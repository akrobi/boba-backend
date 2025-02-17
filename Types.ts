import {
  BoardCategoryDescription,
  BoardTextDescription,
} from "types/rest/boards";

export interface UserIdentityType {
  name: string;
  // TODO[realms]: make this avatar_url
  avatar: string;
}

export interface SecretIdentityType {
  name: string;
  // TODO[realms]: make this avatar_url
  avatar: string;
  color?: string;
  accessory?: string;
}
export interface DbIdentityType {
  id: string;
  username: string;
  user_avatar_reference_id: string;
  display_name: string;
  secret_identity_avatar_reference_id: string;
  friend: boolean;
  self: boolean;
}

export interface DbPostType {
  post_id: string;
  parent_thread_id: string;
  parent_post_id: string | null;
  parent_board_id: string;
  parent_board_slug: string;
  author: number;
  username: string;
  user_avatar: string;
  secret_identity_name: string;
  secret_identity_avatar: string;
  secret_identity_color: string | null;
  accessory_avatar?: string;
  self: boolean;
  friend: boolean;
  created_at: string;
  content: string;
  type: string;
  index_tags: string[];
  category_tags: string[];
  content_warnings: string[];
  whisper_tags: string[];
  anonymity_type: "everyone" | "strangers";
  total_comments_amount: number;
  new_comments_amount: number;
  comments: DbCommentType[] | null;
  is_own: boolean;
  is_new: boolean;
}
export interface DbCommentType {
  comment_id: string;
  parent_post_id: string;
  parent_comment_id: string;
  chain_parent_id: string | null;
  author: number;
  username: string;
  user_avatar: string;
  secret_identity_name: string;
  secret_identity_avatar: string;
  secret_identity_color: string | null;
  accessory_avatar?: string;
  content: string;
  created_at: string;
  anonymity_type: "everyone" | "strangers";
  self: boolean;
  friend: boolean;
  is_new: boolean;
  is_own: boolean;
}

export interface DbThreadType {
  thread_id: string;
  board_slug: string;
  board_id: string;
  realm_slug: string;
  realm_id: string;
  thread_last_activity: string;
  posts: DbPostType[];
  default_view: "thread" | "gallery" | "timeline";
  thread_new_comments_amount: number;
  thread_total_comments_amount: number;
  thread_direct_threads_amount: number;
  thread_new_posts_amount: number;
  thread_total_posts_amount: number;
  muted: boolean;
  hidden: boolean;
  starred: boolean;
}

export interface DbThreadSummaryType
  extends Omit<DbThreadType, "posts">,
    Omit<
      DbPostType,
      "total_comments_amount" | "new_comments_amount" | "comments"
    > {
  thread_last_activity_at_micro: string | null;
}

export interface DbFeedType {
  cursor: string | null;
  activity: DbThreadSummaryType[];
}

export interface DbBoardTextDescription extends BoardTextDescription {
  categories: null;
}

export interface DbBoardCategoryDescription extends BoardCategoryDescription {
  description: null;
}

export interface QueryTagsType {
  whisperTags: string[];
  indexTags: string[];
  categoryTags: string[];
  contentWarnings: string[];
}
