import type { FC } from 'react';
import { Grid, Button } from '@mui/material';
import {
  MachineContext,
  isJob,
  isAssigned,
  jobs,
  isDied,
  users,
} from '../../machine';

type UserGridType =
  | 'mafia'
  | 'pickpocket'
  | 'police'
  | 'doctor'
  | 'priest'
  | 'all'
  | 'die-mode'
  | 'heal-mode';

interface UserGridProps {
  type: UserGridType;
  context: MachineContext;
  onSelectUserClick?: (name: string) => void;
}

const UserGrid: FC<UserGridProps> = ({
  type = 'all',
  context,
  onSelectUserClick,
}) => {
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {users.map((name) => (
        <Grid key={name} item xs={3}>
          <Button
            sx={{
              width: '100%',
              padding: '10px 0',
              color: '#000',
              fontWeight: 'bold',
              backgroundColor: setButtonBackgroundColor(context, type, name),
            }}
            disabled={isDisabled(context, type, name)}
            onClick={() => onSelectUserClick?.(name)}
          >
            {name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserGrid;

function setButtonBackgroundColor(
  context: MachineContext,
  type: UserGridType,
  name: string,
) {
  switch (type) {
    case 'mafia': {
      if (isJob(context, name, jobs.mafia)) {
        return '#FFA7A7';
      } else if (isAssigned(context, name)) {
        return '#D5D5D5';
      } else {
        return '#F6F6F6';
      }
    }
    case 'pickpocket': {
      if (isJob(context, name, jobs.pickpocket)) {
        return '#FFE08C';
      } else if (isAssigned(context, name)) {
        return '#D5D5D5';
      } else {
        return '#F6F6F6';
      }
    }
    case 'police': {
      if (isJob(context, name, jobs.police)) {
        return '#6799FF';
      } else if (isAssigned(context, name)) {
        return '#D5D5D5';
      } else {
        return '#F6F6F6';
      }
    }
    case 'doctor': {
      if (isJob(context, name, jobs.doctor)) {
        return '#FFB2F5';
      } else if (isAssigned(context, name)) {
        return '#D5D5D5';
      } else {
        return '#F6F6F6';
      }
    }
    case 'priest': {
      if (isJob(context, name, jobs.priest)) {
        return '#D1B2FF';
      } else if (isAssigned(context, name)) {
        return '#D5D5D5';
      } else {
        return '#F6F6F6';
      }
    }
    case 'all': {
      if (isJob(context, name, jobs.mafia)) {
        return '#FFA7A7';
      } else if (isJob(context, name, jobs.pickpocket)) {
        return '#FFE08C';
      } else if (isJob(context, name, jobs.police)) {
        return '#6799FF';
      } else if (isJob(context, name, jobs.doctor)) {
        return '#FFB2F5';
      } else if (isJob(context, name, jobs.priest)) {
        return '#D1B2FF';
      } else {
        return '#F6F6F6';
      }
    }
    case 'heal-mode':
    case 'die-mode': {
      if (isDied(context, name)) {
        return '#BDBDBD';
      }

      if (isJob(context, name, jobs.mafia)) {
        return '#FFA7A7';
      } else if (isJob(context, name, jobs.pickpocket)) {
        return '#FFE08C';
      } else if (isJob(context, name, jobs.police)) {
        return '#6799FF';
      } else if (isJob(context, name, jobs.doctor)) {
        return '#FFB2F5';
      } else if (isJob(context, name, jobs.priest)) {
        return '#D1B2FF';
      } else {
        return '#F6F6F6';
      }
    }
    default: {
      break;
    }
  }

  return '';
}

function isDisabled(context: MachineContext, type: UserGridType, name: string) {
  switch (type) {
    case 'mafia': {
      return !isJob(context, name, jobs.mafia) && isAssigned(context, name);
    }
    case 'pickpocket': {
      return (
        !isJob(context, name, jobs.pickpocket) && isAssigned(context, name)
      );
    }
    case 'police': {
      return !isJob(context, name, jobs.police) && isAssigned(context, name);
    }
    case 'doctor': {
      return !isJob(context, name, jobs.doctor) && isAssigned(context, name);
    }
    case 'priest': {
      return !isJob(context, name, jobs.priest) && isAssigned(context, name);
    }
    case 'all': {
      return false;
    }
    case 'die-mode': {
      if (isDied(context, name)) {
        return true;
      }

      return false;
    }
    case 'heal-mode':
    default: {
      return false;
    }
  }
}
