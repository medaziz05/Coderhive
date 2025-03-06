export interface ComplaintResponse {
  idresponse?: number; // Optional, as it may not be set when creating a new response
  message: string; // The content of the response
  date?: Date; // Optional, as it will be set automatically
  complaintId?: number; // Optional, to link the response to a specific complaint
}
