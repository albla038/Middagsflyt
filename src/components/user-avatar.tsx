import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameToInitials } from "@/lib/utils";
import { User } from "better-auth";

type UserAvatarProps = {
  user: User;
  className?: string;
};

export default function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.image || `https://avatar.vercel.sh/${user.email}`}
        alt={user.name}
      />

      <AvatarFallback>
        {user.name || user.name.length > 0
          ? nameToInitials(user.name)
          : user.email.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
