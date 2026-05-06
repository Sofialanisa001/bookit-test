let logoutHandler = null;

// Se usa desde React (AuthContext)
// Se guarda la funcion de logout para poder usarlo en otros archivos
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// Se usa desde axios (apiClient)
// Ejecuta el logout si ya fue registrado previamente
export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  }
};
