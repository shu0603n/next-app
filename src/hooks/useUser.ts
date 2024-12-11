// next
import { useSession } from 'next-auth/react';

interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  jobCategories: string;
  roles: Roles;
}

interface Roles {
  superRole: boolean;
  systemRole: boolean;
  employeeView: boolean;
  clientView: boolean;
  projectView: boolean;
  employeeEdit: boolean;
  clientEdit: boolean;
  projectEdit: boolean;
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

    const newUser: UserProps = {
      id: session?.id!, // ID を追加
      name: user!.name!,
      email: user!.email!,
      avatar: user?.image!,
      thumb,
      jobCategories: session?.jobCategories!,
      roles: session?.roles!
    };

    return newUser;
  }
  return undefined;
};

export default useUser;
