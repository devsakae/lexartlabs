import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    console.log('Body incoming:', req.body);
    return res.status(200).json({ message: 'Your response' });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json(error);
  }
}