const getRealmBySlug = `
    SELECT 
      realms.string_id AS realm_id,
      realms.slug AS realm_slug,
      array_to_json(
        array_agg(block_with_rules)) AS homepage_blocks
    FROM realms 
      JOIN realm_homepage_blocks AS rhb
        ON realms.id = rhb.realm_id 
      JOIN (
        SELECT 
          blocks.id,
          blocks.string_id,
          blocks.title,
          blocks.index,
          blocks.type,
          array_to_json(array_agg(rules)) AS rules
        FROM blocks
          JOIN block_rules AS br 
            ON br.block_id = blocks.id 
          JOIN rules
            ON br.rule_id = rules.id
        GROUP BY blocks.id, blocks.string_id, blocks.title, blocks.index, blocks.type
      ) AS block_with_rules
        ON rhb.block_id = block_with_rules.id
    WHERE slug = $/realm_slug/
    GROUP BY realms.string_id, realms.slug;`;

const dismissNotifications = `
    INSERT INTO dismiss_notifications_requests(user_id, realm_id, dismiss_request_time) VALUES (
        (SELECT id FROM users WHERE users.firebase_id = $/firebase_id/),
        (SELECT id FROM realms WHERE realms.string_id = $/realm_id/),
         DEFAULT)
    ON CONFLICT(user_id, realm_id) DO UPDATE 
        SET dismiss_request_time = DEFAULT
        WHERE dismiss_notifications_requests.user_id = (SELECT id FROM users WHERE users.firebase_id = $/firebase_id/)
          AND dismiss_notifications_requests.realm_id = (SELECT id FROM realms WHERE realms.string_id = $/realm_id/)`;

export default {
  getRealmBySlug,
  dismissNotifications,
};
