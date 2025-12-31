import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Backend_URL="https://it-developer-be-rathi.onrender.com";

export const api = createApi({
    reducerPath: "api",
   baseQuery: fetchBaseQuery({
    baseUrl: `${Backend_URL}/api/`,
    prepareHeaders: async (headers) => {
      const token = await window?.Clerk?.session?.getToken();
      console.log(token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }),
  
    endpoints: (builder) => ({ // endpoints means the calls that we want to make to the backend from frontend
      // Board endpoints
      createBoard: builder.mutation({
        query: (boardData) => ({
          url: "kanban/boards",
          method: "POST",
          body: boardData,
        }),
      }),
      getAllBoards: builder.query({
        query: () => "kanban/boards",
      }),
      getBoardById: builder.query({
        query: (boardId) => `kanban/boards/${boardId}`,
      }),
      updateBoard: builder.mutation({
        query: ({ boardId, ...data }) => ({
          url: `kanban/boards/${boardId}`,
          method: "PUT",
          body: data,
        }),
      }),
      deleteBoard: builder.mutation({
        query: (boardId) => ({
          url: `kanban/boards/${boardId}`,
          method: "DELETE",
        }),
      }),

      // Column endpoints
      createColumn: builder.mutation({
        query: (columnData) => ({
          url: "kanban/columns",
          method: "POST",
          body: columnData,
        }),
      }),
      getColumnsByBoard: builder.query({
        query: (boardId) => `kanban/boards/${boardId}/columns`,
      }),
      updateColumn: builder.mutation({
        query: ({ columnId, ...data }) => ({
          url: `kanban/columns/${columnId}`,
          method: "PUT",
          body: data,
        }),
      }),
      deleteColumn: builder.mutation({
        query: (columnId) => ({
          url: `kanban/columns/${columnId}`,
          method: "DELETE",
        }),
      }),

      // Card endpoints
      createCard: builder.mutation({
        query: (cardData) => ({
          url: "kanban/cards",
          method: "POST",
          body: cardData,
        }),
      }),
      getCardsByColumn: builder.query({
        query: (columnId) => `kanban/columns/${columnId}/cards`,
      }),
      getCardsByBoard: builder.query({
        query: (boardId) => `kanban/boards/${boardId}/cards`,
      }),
      updateCard: builder.mutation({
        query: ({ cardId, ...data }) => ({
          url: `kanban/cards/${cardId}`,
          method: "PUT",
          body: data,
        }),
      }),
      moveCard: builder.mutation({
        query: (moveData) => ({
          url: "kanban/cards/move",
          method: "POST",
          body: moveData,
        }),
      }),
      deleteCard: builder.mutation({
        query: (cardId) => ({
          url: `kanban/cards/${cardId}`,
          method: "DELETE",
        }),
      }),

      // Board Member endpoints
      addMemberToBoard: builder.mutation({
        query: (memberData) => ({
          url: "kanban/boards/members",
          method: "POST",
          body: memberData,
        }),
      }),
      getBoardMembers: builder.query({
        query: (boardId) => `kanban/boards/${boardId}/members`,
      }),
      updateMemberRole: builder.mutation({
        query: (roleData) => ({
          url: "kanban/boards/members/role",
          method: "PUT",
          body: roleData,
        }),
      }),
      removeMemberFromBoard: builder.mutation({
        query: (removeData) => ({
          url: "kanban/boards/members",
          method: "DELETE",
          body: removeData,
        }),
      }),

      // Comment endpoints
      createComment: builder.mutation({
        query: (commentData) => ({
          url: "kanban/comments",
          method: "POST",
          body: commentData,
        }),
      }),
      getCommentsByCard: builder.query({
        query: (cardId) => `kanban/cards/${cardId}/comments`,
      }),
      updateComment: builder.mutation({
        query: ({ commentId, ...data }) => ({
          url: `kanban/comments/${commentId}`,
          method: "PUT",
          body: data,
        }),
      }),
      deleteComment: builder.mutation({
        query: (commentId) => ({
          url: `kanban/comments/${commentId}`,
          method: "DELETE",
        }),
      }),

      // Notification endpoints
      getUserNotifications: builder.query({
        query: () => "kanban/notifications",
      }),
      getUnreadNotificationCount: builder.query({
        query: () => "kanban/notifications/unread/count",
      }),
      markNotificationAsRead: builder.mutation({
        query: (notificationId) => ({
          url: `kanban/notifications/${notificationId}/read`,
          method: "PUT",
        }),
      }),
      markAllNotificationsAsRead: builder.mutation({
        query: () => ({
          url: "kanban/notifications/read-all",
          method: "PUT",
        }),
      }),
    }),
});

export const {
  useCreateBoardMutation,
  useGetAllBoardsQuery,
  useGetBoardByIdQuery,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useCreateColumnMutation,
  useGetColumnsByBoardQuery,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useCreateCardMutation,
  useGetCardsByColumnQuery,
  useGetCardsByBoardQuery,
  useUpdateCardMutation,
  useMoveCardMutation,
  useDeleteCardMutation,
  useAddMemberToBoardMutation,
  useGetBoardMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberFromBoardMutation,
  useCreateCommentMutation,
  useGetCommentsByCardQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetUserNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = api;