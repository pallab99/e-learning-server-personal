export const generateFileName = (
  path: string,
  identifier: string,
  fileName: string
) => {
  return `${path}/${identifier}/${Date.now()}-${fileName}`.replace(/ /g, "");
};
