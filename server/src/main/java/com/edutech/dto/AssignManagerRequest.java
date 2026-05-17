// package com.edutech.dto;

// public class AssignManagerRequest {
//     private Long restaurantId;
//     private Long user;
// 	public Long getRestaurantId() {
// 		return restaurantId;
// 	}
// 	public void setRestaurantId(Long restaurantId) {
// 		this.restaurantId = restaurantId;
// 	}
// 	public Long getUser() {
// 		return user;
// 	}
// 	public void setUser(Long user) {
// 		this.user = user;
// 	}

    
// }
package com.edutech.dto;

public class AssignManagerRequest {

    private Long restaurantId;
    private Long managerId;

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
}