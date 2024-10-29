// next
import { useSession } from 'next-auth/react';

interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  jobCategories: string;
}

const useUser = () => {
  const { data: session } = useSession();
  if (session) {
    const user = session?.user;
    let thumb = user?.image!;

    if (!user?.image) {
      user!.image = '/assets/images/users/avatar-1.png';
      thumb = '/assets/images/users/avatar-thumb-1.png';
    }

    console.log('useSession', session);
    const newUser: UserProps = {
      id: session?.id!, // ID を追加
      name: user!.name!,
      email: user!.email!,
      avatar: user?.image!,
      thumb,
      jobCategories: session?.jobCategories!
    };

    return newUser;
  }
  return undefined;
};

export default useUser;
