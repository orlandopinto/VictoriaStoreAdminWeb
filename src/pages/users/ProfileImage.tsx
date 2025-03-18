import { RefObject } from "react";

interface Props {
     fullName: [string, string],
     profileImageBackgroundColor: string,
     ref?: RefObject<HTMLSpanElement | null>
}

const ProfileImage = ({ fullName, profileImageBackgroundColor }: Props) => {

     const firstNameInitial = fullName[0][0];
     const lastNameInitial = fullName[1][0];

     return (
          <span className="user-profile-image" style={{ backgroundColor: profileImageBackgroundColor }}>
               {firstNameInitial}{lastNameInitial}
          </span>
     );
};

export default ProfileImage;