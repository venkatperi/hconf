module.exports = function(opts) {
  return {
    name: opts.pkg.name,
    description: opts.description || "custom file",
    type: opts.type || 'file',
    file: opts.file || opts.filename
  };
};
