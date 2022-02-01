export const knownRegex: Record<string, RegExp> = {
  email: /^[\w!#$%&*+./=?^`{|}~’-]+@[\da-z-]+(?:\.[\da-z-]+)*$/i,
  url: /^(http(s)?:\/\/.)?(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,6}\b([\w#%&+./:=?@~-]*)$/
};
