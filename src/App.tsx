import {
  Box,
  Stepper,
  Step,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useMachine } from '@xstate/react';
import { uniq } from 'lodash';

import machine, { jobs, steps } from './machine';
import UserGrid from './components/UserGrid';
import Countdown from './components/Countdown';

const users = [
  '김규식',
  '김순철',
  '류진영',
  '민홍기',
  '박제훈',
  '박찬민',
  '염서연',
  '오평',
  '이상진',
  '이장춘',
  '임정목',
  '현태수',
] as const;

const keyOfSteps = Object.keys(steps);

function App() {
  const [state, send] = useMachine(machine, {});
  const currentStep = state.value as string;
  const indexOfActiveStep = keyOfSteps.indexOf(currentStep);
  const context = state.context;

  const { mafia, pickpocket, police, doctor, priest, died, jobless } = context;

  const citizenTeam = uniq([
    ...police,
    ...doctor,
    ...priest,
    ...jobless,
  ]).filter((name) => !died.includes(name));
  const mafiaTeam = uniq([...mafia, ...pickpocket]).filter(
    (name) => !died.includes(name),
  );

  const handleSelectUserClick = ({
    jobName,
    userName,
  }: {
    jobName: string;
    userName: string;
  }) => {
    switch (jobName) {
      case 'mafia': {
        send('ASSIGN_MAFIA', { name: userName });
        break;
      }
      case 'pickpocket': {
        send('ASSIGN_PICKPOCKET', { name: userName });
        break;
      }
      case 'police': {
        send('ASSIGN_POLICE', { name: userName });
        break;
      }
      case 'doctor': {
        send('ASSIGN_DOCTOR', { name: userName });
        break;
      }
      case 'priest': {
        send('ASSIGN_PRIEST', { name: userName });
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleResetClick = () => {
    send('RESTART');
  };

  const handleNextClick = () => {
    send('COMPLETE');
  };

  return (
    <div>
      <Box component="header" sx={{ marginBottom: '20px' }}>
        <Stepper
          nonLinear
          activeStep={indexOfActiveStep}
          sx={{ marginBottom: '10px' }}
        >
          {keyOfSteps.map((label, index) => {
            const isCurrentStep = indexOfActiveStep === index;
            return (
              <Step
                key={label}
                completed={true}
                sx={
                  isCurrentStep
                    ? { backgroundColor: 'yellow' }
                    : { backgroundColor: 'white' }
                }
              >
                <Typography variant="subtitle2">{label}</Typography>
              </Step>
            );
          })}
        </Stepper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={1}>
            <Paper
              sx={{
                padding: '10px 0',
                backgroundColor: '#FFA7A7',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#000', fontWeight: 'bold' }}
              >
                마피아
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <Paper
              sx={{
                padding: '10px 0',
                backgroundColor: '#FFE08C',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#000', fontWeight: 'bold' }}
              >
                좀도둑
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <Paper
              sx={{
                padding: '10px 0',
                backgroundColor: '#6799FF',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#000', fontWeight: 'bold' }}
              >
                경찰
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <Paper
              sx={{
                padding: '10px 0',
                backgroundColor: '#FFB2F5',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#000', fontWeight: 'bold' }}
              >
                의사
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <Paper
              sx={{
                padding: '10px 0',
                backgroundColor: '#D1B2FF',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#000', fontWeight: 'bold' }}
              >
                영매
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography>시민팀 : {citizenTeam.length}</Typography>
        <Typography>마피아팀 : {mafiaTeam.length}</Typography>
      </Box>

      {currentStep === steps.READY && (
        <Box>
          <Typography variant="h6">마피아</Typography>
          <UserGrid
            type="mafia"
            context={context}
            onSelectUserClick={(name) =>
              handleSelectUserClick({ userName: name, jobName: jobs.mafia })
            }
          />

          <Typography variant="h6">좀도둑</Typography>
          <UserGrid
            type="pickpocket"
            context={context}
            onSelectUserClick={(name) =>
              handleSelectUserClick({
                userName: name,
                jobName: jobs.pickpocket,
              })
            }
          />

          <Typography variant="h6">경찰</Typography>
          <UserGrid
            type="police"
            context={context}
            onSelectUserClick={(name) =>
              handleSelectUserClick({
                userName: name,
                jobName: jobs.police,
              })
            }
          />

          <Typography variant="h6">의사</Typography>
          <UserGrid
            type="doctor"
            context={context}
            onSelectUserClick={(name) =>
              handleSelectUserClick({
                userName: name,
                jobName: jobs.doctor,
              })
            }
          />

          <Typography variant="h6">영매</Typography>
          <UserGrid
            type="priest"
            context={context}
            onSelectUserClick={(name) =>
              handleSelectUserClick({
                userName: name,
                jobName: jobs.priest,
              })
            }
          />
        </Box>
      )}

      {currentStep === steps.INGAME && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              send('START');
            }}
          >
            START
          </Button>
        </Box>
      )}

      {currentStep === steps.INGAME_MORNING && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold' }}>1. 토론</Typography>

          <Box sx={{ marginBottom: '5px' }} />

          <Countdown />

          <Box sx={{ marginBottom: '15px' }} />

          <Typography sx={{ fontWeight: 'bold' }}>2. 투표</Typography>
          <UserGrid
            type="die-mode"
            context={context}
            onSelectUserClick={(name) => {
              send('VOTE', { name });
            }}
          />

          <Box sx={{ marginBottom: '15px' }} />

          <Box>
            <Button
              variant="contained"
              onClick={() => {
                send('END');
              }}
            >
              밤으로
            </Button>
          </Box>
        </Box>
      )}

      {currentStep === steps.INGAME_NIGHT && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold' }}>1. 좀도둑</Typography>
          <ul>
            <li>투표권 빼앗아 올 사람 선택하게 하기</li>
          </ul>

          <Box sx={{ marginBottom: '15px' }} />

          <Typography sx={{ fontWeight: 'bold' }}>2. 마피아</Typography>
          <UserGrid
            type="die-mode"
            context={context}
            onSelectUserClick={(name) => {
              send('ACTION_MAFIA', { name });
            }}
          />

          <Box sx={{ marginBottom: '15px' }} />

          <Typography sx={{ fontWeight: 'bold' }}>3. 경찰</Typography>
          <ul>
            <li>한 명 직업 조사하기</li>
          </ul>

          <Box sx={{ marginBottom: '15px' }} />

          <Typography sx={{ fontWeight: 'bold' }}>4. 의사</Typography>
          <UserGrid
            type="heal-mode"
            context={context}
            onSelectUserClick={(name) => {
              send('ACTION_DOCTORL', { name });
            }}
          />

          <Box sx={{ marginBottom: '15px' }} />

          <Button
            variant="contained"
            onClick={() => {
              send('END');
            }}
          >
            아침으로
          </Button>
        </Box>
      )}

      {currentStep === steps.END && (
        <Box>
          <Button variant="contained"></Button>
        </Box>
      )}

      <Box>
        <Button variant="contained" onClick={handleResetClick}>
          게임 초기화
        </Button>
        {currentStep === steps.READY && (
          <Button variant="contained" onClick={handleNextClick}>
            다음
          </Button>
        )}
      </Box>
    </div>
  );
}

export default App;
