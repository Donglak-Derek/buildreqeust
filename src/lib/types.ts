export type RequestStatus = 'pending' | 'scheduled' | 'in-build' | 'ready-for-pickup';
export type RequesterRole = 'VM' | 'ID' | 'Sales';
export type SizeCategory = 'Small' | 'Medium' | 'Large/Heavy';
export type PickupMethod = 'SS' | 'FS';

export interface Item {
  articleNumber: string;
  name: string;
  warehouseLocation: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface BuildRequest {
  id: string;
  articleNumber: string;
  itemName: string;
  warehouseLocation: string;
  stockStatus: string;
  projectDueDate: string;
  status: RequestStatus;
  requesterRole: RequesterRole;
  projectName: string;
  sizeCategory: SizeCategory;
  pickupMethod: PickupMethod;
  deliveryWindow?: string;
  missingStock?: boolean;
  lateDelivery?: boolean;
}

export interface UserRole {
  role: 'builder' | 'requester';
}
