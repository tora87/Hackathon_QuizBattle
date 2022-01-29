var users = [
    {
        user: "admin",
        pwd: "admin",
        roles: [
            { role: "readWrite", db: "session" }
        ]
    }
];

users.forEach(user => {
    db.createUser(user);
});
