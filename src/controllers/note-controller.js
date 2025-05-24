const dummyParticipants = [
  { id: 1, email: "alice@example.com" },
  { id: 2, email: "bob@example.com" },
  { id: 3, email: "charlie@samiori.com" },
  { id: 4, email: "dana@samiori.com" },
  { id: 5, email: "eva@samiori.com" },
];

export const getAllNotes = async (req, res) => {
  const winningPrize = "1% of Samiori Share";
  const totalParticipants = dummyParticipants.length;

  return res.json({
    participants: dummyParticipants,
    totalParticipants,
    winningPrize,
  });
};

export const createNote = async (req, res) => {
  try {
    const { email } = req.body || {};

    const newId = dummyParticipants.length + 1;
    dummyParticipants.push({ id: newId, email });

    const winningPrize = "1% of Samiori Share";

    return res.status(201).json({
      message: "🎉 You won " + winningPrize + "!",
      newParticipant: { id: newId, email },
      totalParticipants: dummyParticipants.length,
      winningPrize,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
