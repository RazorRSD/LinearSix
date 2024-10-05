USE testDb;
SELECT u.*, g.* FROM `user` u
	INNER JOIN `groupmembership` gm ON u.id = gm.userID
    INNER JOIN `group` g ON g.id = gm.groupID
    WHERE u.created <= g.created;