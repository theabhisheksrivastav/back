import request from "./api.js";

export async function createAppointment(data) {
  return request("/appointments", "POST", data);
}

export async function getAppointments() {
  return request(`/appointments/my-appointments`, "GET", null, true);
}

export async function getAppointmentsForUser(appointmentId) {
  return request(`/appointments/public/${appointmentId}`, "GET");
}

export async function updateAppointment(id, data) {
  return request(`/appointments/${id}/update`, "PATCH", { data }, true);
}

export async function deleteAppointment(id) {
  return request(`/appointments/${id}`, "DELETE", null, true);
}