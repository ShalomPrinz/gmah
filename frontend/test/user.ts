import userEvent from "@testing-library/user-event";

function setupUser() {
  return userEvent.setup();
}

export { setupUser };
