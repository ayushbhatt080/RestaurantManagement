export interface RestaurantManagerAssignmentDTO {
  assignmentId: number;
  restaurantName: string;
  restaurantLocation: string;
  managerUsername?: string;
  managerEmail: string;
  assignedAt: Date;
}