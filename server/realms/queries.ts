import { DbRolePermissions, RealmPermissions } from "types/permissions";
import { filterOutDisabledSettings, getRealmCursorSetting } from "./utils";

import { CssVariableSetting } from "../../types/settings";
import { SettingEntry } from "../../types/settings";
import { extractRealmPermissions } from "utils/permissions-utils";
import pool from "server/db-pool";
import sql from "./sql";

const CURSOR_SETTINGS = {
  // image: "https://cur.cursors-4u.net/nature/nat-2/nat120.cur",
  // trail: "/smoke.gif",
};

const INDEX_PAGE_SETTINGS: CssVariableSetting[] = [
  // {
  //   name: "header-background-image",
  //   type: "CssVariable",
  //   value: "url(/weed4.png)",
  // },
];

const BOARD_PAGE_SETTINGS: CssVariableSetting[] = [
  // {
  //   name: "feed-background-image",
  //   type: "CssVariable",
  //   value: "url(/weed4.png)",
  // },
];

const THREAD_PAGE_SETTINGS: CssVariableSetting[] = [
  // {
  //   name: "sidebar-background-image",
  //   type: "CssVariable",
  //   value: "url(/weed4.png)",
  // },
];
export const getSettingsBySlug = async ({
  userSettings,
  realmSlug,
}: {
  userSettings: SettingEntry[];
  realmSlug: string;
}) => {
  const baseSettings = {
    root: {},
    index_page: [] as CssVariableSetting[],
    board_page: [] as CssVariableSetting[],
    thread_page: [] as CssVariableSetting[],
  };
  // TODO: make a type of base settings so cursor is a known property.
  // @ts-expect-error
  baseSettings.root.cursor = getRealmCursorSetting(
    CURSOR_SETTINGS,
    userSettings
  );
  baseSettings.index_page = filterOutDisabledSettings(
    INDEX_PAGE_SETTINGS,
    userSettings
  );
  baseSettings.board_page = filterOutDisabledSettings(
    BOARD_PAGE_SETTINGS,
    userSettings
  );
  baseSettings.thread_page = filterOutDisabledSettings(
    THREAD_PAGE_SETTINGS,
    userSettings
  );
  return baseSettings;
};

export const getRealmDataBySlug = async ({
  realmSlug,
}: {
  realmSlug: string;
}): Promise<{
  id: string;
  string_id: string;
  slug: string;
} | null> => {
  return await pool.oneOrNone(sql.getRealmBySlug, {
    realm_slug: realmSlug,
  });
};

// I added this before realizing I didn't actually need it for what I was doing
// I can leave it in if it will be helpful in future, or I can delete it?
export const getRealmByUuid = async ({
  realmId,
}: {
  realmId: string;
}): Promise<{
  id: string;
  string_id: string;
  slug: string;
} | null> => {
  return await pool.oneOrNone(sql.getRealmByUuid, {
    realm_id: realmId,
  });
};

export const getUserPermissionsForRealm = async ({
  firebaseId,
  realmId,
}: {
  firebaseId: string;
  realmId: string;
}): Promise<RealmPermissions[] | null> => {
  const userPermissionsGroupedByRoles = await pool.manyOrNone(
    sql.getUserPermissionsForRealm,
    {
      user_id: firebaseId,
      realm_id: realmId,
    }
  );
  if (!userPermissionsGroupedByRoles.length) {
    return;
  }
  const userRealmPermissionsGroupedByRoles = userPermissionsGroupedByRoles.map(
    (row) => {
      return extractRealmPermissions(row.permissions);
    }
  );
  return userRealmPermissionsGroupedByRoles.reduce(
    (userRealmPermissions, userRealmPermissionsGroup) => {
      return userRealmPermissions.concat(userRealmPermissionsGroup);
    },
    []
  );
};
