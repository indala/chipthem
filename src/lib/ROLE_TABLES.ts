export const ROLE_TABLES = {
  admin: {
    table: "admins",
    passwordCol: "password_hash",
    idCol: "id",
  },
  veterinary: {
    table: "veterinary_clinics",
    passwordCol: "password_hash",
    idCol: "id",
  },
  petOwner: {
    table: "owners",
    passwordCol: "password_hash",
    idCol: "id",
  },
};
