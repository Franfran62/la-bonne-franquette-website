class User {
    id;
    username;
    restaurantId;
    roles;

    constructor(id,username,restaurantId,roles) {
        this.id = id;
        this.username = username;
        this.restaurantId = restaurantId;
        this.roles = roles;
    }
}

export default User;