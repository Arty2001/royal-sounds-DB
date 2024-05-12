import clientPromise from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export const userService = {
    authenticate,
  };
  
async function authenticate(username: string, password: string)  {

    try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ email:username });

      if (!user) {
        return null;
      }

      const returnUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return null;
      }

      return returnUser;
    } catch (error) {
      console.log("Error: ", error);
    }

    return null
  }