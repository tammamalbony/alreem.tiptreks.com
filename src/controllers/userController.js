export const getUsers = (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
};

export const createUser = (req, res) => {
  const { name } = req.body;
  // TODO: persist to DB
  res.status(201).json({ id: Date.now(), name });
};
