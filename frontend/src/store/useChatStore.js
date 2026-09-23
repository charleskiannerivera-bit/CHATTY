import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create(
  persist(
    (set, get) => ({
      users: [],
      conversations: [],
      messages: [],
      selectedUser: null,

      isConversationsLoading: false,
      isUsersLoading: false,
      isMessagesLoading: false,
      isSendingMedia: false,

      activeConversationId: null,
      searchQuery: "",
      sidebarTab: "chats",
      composerText: "",
      isSoundEnabled: true,

      // =========================
      // USERS
      // =========================

      getUsers: async () => {
        set({ isUsersLoading: true });

        try {
          const res = await axiosInstance.get("/messages/users");

          set((state) => ({
            users: res.data,

            selectedUser:
              state.selectedUser &&
              res.data.some((user) => user._id === state.selectedUser._id)
                ? state.selectedUser
                : null,
          }));
        } catch (error) {
          console.error("Error in getUsers:", error);
        } finally {
          set({ isUsersLoading: false });
        }
      },

      // =========================
      // CONVERSATIONS
      // =========================

      getConversations: async () => {
        set({ isConversationsLoading: true });

        try {
          const res = await axiosInstance.get("/messages/conversations");

          set({
            conversations: res.data,
          });
        } catch (error) {
          console.error("Error in getConversations:", error);
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      // =========================
      // MESSAGES
      // =========================

      getMessages: async (userId) => {
        if (!userId) {
          set({
            messages: [],
            isMessagesLoading: false,
          });
          return;
        }

        set({
          isMessagesLoading: true,
          messages: [],
        });

        try {
          const res = await axiosInstance.get(`/messages/${userId}`);

          set({
            messages: res.data,
          });

          console.log(
            `Loaded ${res.data.length} messages for conversation ${userId}`,
          );
        } catch (error) {
          console.error("Error getting messages:", error);

          toast.error(
            error.response?.data?.message || "Failed to load messages",
          );

          set({
            messages: [],
          });
        } finally {
          set({
            isMessagesLoading: false,
          });
        }
      },

      // =========================
      // SEND MESSAGE
      // =========================

      sendMessage: async (receiverId, messageData) => {
        if (!receiverId) return false;

        const authUser = useAuthStore.getState().authUser;

        // Prevent sending to yourself
        if (authUser?._id && String(receiverId) === String(authUser._id)) {
          toast.error("You cannot message yourself.");
          return false;
        }

        try {
          const res = await axiosInstance.post(
            `/messages/send/${receiverId}`,
            messageData,
          );

          // Add the newly-created MongoDB message
          // to the currently open conversation.
          set((state) => ({
            messages: [...state.messages, res.data],
            composerText: "",
          }));

          // Refresh conversation list
          await get().getConversations();

          return true;
        } catch (error) {
          console.error("Send message error:", error);

          toast.error(
            error.response?.data?.message || "Failed to send message",
          );

          return false;
        }
      },

      // =========================
      // REALTIME SOCKET
      // =========================

      subscribeToMessages: (userId) => {
        if (!userId) return;

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
          // Only accept messages from the
          // currently selected conversation.
          if (String(newMessage.senderId) !== String(userId)) {
            return;
          }

          set((state) => ({
            messages: [...state.messages, newMessage],
          }));

          get().getConversations();
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket?.off("newMessage");
      },

      // =========================
      // SELECT CONVERSATION
      // =========================

      setSelectedUser: (selectedUser) => {
        if (!selectedUser) {
          set({
            selectedUser: null,
            activeConversationId: null,
            messages: [],
          });

          return;
        }

        set({
          selectedUser,
          activeConversationId: selectedUser._id,
          messages: [],
        });
      },

      setActiveConversationId: (activeConversationId) => {
        const authUser = useAuthStore.getState().authUser;

        // Never allow yourself to be selected
        if (
          authUser?._id &&
          String(activeConversationId) === String(authUser._id)
        ) {
          console.warn("Blocked self conversation:", activeConversationId);

          return;
        }

        set((state) => {
          const selectedUser =
            state.users.find(
              (user) => String(user._id) === String(activeConversationId),
            ) ||
            state.conversations.find(
              (user) => String(user._id) === String(activeConversationId),
            ) ||
            null;

          return {
            activeConversationId,
            selectedUser,
            messages: [],
          };
        });
      },

      // =========================
      // UI
      // =========================

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSidebarTab: (sidebarTab) => set({ sidebarTab }),

      setComposerText: (composerText) => set({ composerText }),

      setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),

      // =========================
      // TEXT MESSAGE
      // =========================

      sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim();

        if (!conversationId || !messageText) {
          return false;
        }

        return get().sendMessage(conversationId, {
          text: messageText,
        });
      },

      // =========================
      // MEDIA MESSAGE
      // =========================

      sendMediaMessage: async ({ conversationId, file }) => {
        if (!conversationId || !file) {
          return false;
        }

        const formData = new FormData();

        formData.append("media", file);

        set({
          isSendingMedia: true,
        });

        try {
          return await get().sendMessage(conversationId, formData);
        } finally {
          set({
            isSendingMedia: false,
          });
        }
      },
    }),
    {
      name: "imessage-storage",

      // Only UI preference needs local persistence.
      // Messages come from MongoDB.
      partialize: (state) => ({
        isSoundEnabled: state.isSoundEnabled,
      }),
    },
  ),
);
