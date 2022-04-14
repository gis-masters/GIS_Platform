export const knownRegex: Record<string, RegExp> = {
  email: /^[\w!#$%&*+./=?^`{|}~’-]+@[\da-z-]+(?:\.[\da-z-]+)*$/i,
  url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-zа-я]+([.-][\da-zа-я]+)*\.[a-zа-я]{2,5}(:\d{1,5})?(\/.*)?$/,
  netbiosUrl: /^\\\\([A-Za-zА-я]+(\\[\w .А-я]+)+)$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z]).{8,}$/,
  relativeUrl: /^[\w #%&+./:=?@~А-я-]*$/i
};
