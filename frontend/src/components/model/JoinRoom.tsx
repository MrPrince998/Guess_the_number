import type { RoomDetails } from './CreateRoom';
import type { UserDetails } from '@/pages/main-menu/MainMenu';



interface joinRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roomDetails?: RoomDetails | null;
  creatorId?: string | null;
  UserDetails?: UserDetails;
}


const JoinRoom = ({open, onOpenChange, roomDetails, onSuccess, userDetails}: joinRoomProps) => {
  return (
    <div>
      
    </div>
  )
}

export default JoinRoom
