USE testDb;
SELECT `firstName`, `lastName` FROM `user` u
	LEFT JOIN `groupmembership` gm ON u.id = gm.userID
    LEFT JOIN `group` g ON g.id = gm.groupID
    WHERE u.firstName LIKE "Victor" AND g.name NOT LIKE "TEST%";