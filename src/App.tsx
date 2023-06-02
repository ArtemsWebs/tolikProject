// eslint-disable-next-line import/no-cycle
import React, { useCallback, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import './App.css';
import md5 from 'crypto-js/md5';
import { faker } from '@faker-js/faker';
import * as dateFns from 'date-fns';
import { Box, Button, styled, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddDangerousModal from './components/AddDangerousModal';
import { UserInfo } from './types/SharedTypes';
import { dangerousCodes, vulnerabilityCodeOne } from './utils/const';

const rows: GridRowsProp = [
  {
    id: 1,
    codeDanger: 'Hello',
    codeStopable: 'World',
    active: 'fwef',
    costActive: '1234',
    costThreats: '213',
    realiseVariant: 'realiseVariant',
    processingMethod: 'wefwef',
    costProcessing: 'wefwef',
    assignee: 'Уполномоченый',
  },
];

const columns: GridColDef[] = [
  { field: 'codeDanger', headerName: 'Код угрозы', width: 150 },
  { field: 'codeStopable', headerName: 'Код уязвимости', width: 150 },
  { field: 'active', headerName: 'Актив', width: 150 },
  { field: 'costActive', headerName: 'Ценность Актива', width: 150 },
  { field: 'costThreats', headerName: 'Оценка ущерба', width: 150 },
  { field: 'realiseVariant', headerName: 'Вероятность реализации', width: 150 },
  { field: 'processingMethod', headerName: 'Способ обработки ', width: 150 },
  { field: 'costProcessing', headerName: 'Затраты на обработку', width: 150 },
  { field: 'assignee', headerName: 'Ответственный', width: 150 },
];

const getCostStatus = (
  dangerousCode: string,
  vulnerabilityCode: string,
  activeCost?: string,
  damageProbability?: string,
) => {
  if (
    dangerousCode === dangerousCodes[0] &&
    vulnerabilityCode === vulnerabilityCodeOne[0] &&
    activeCost === 'critical' &&
    damageProbability === 'high'
  )
    return 'Недопустимо';
  else if (
    dangerousCode === dangerousCodes[0] &&
    vulnerabilityCode === vulnerabilityCodeOne[0] &&
    activeCost === 'high' &&
    damageProbability === 'high'
  )
    return 'Недопустимо';
  else if (
    dangerousCode === dangerousCodes[0] &&
    vulnerabilityCode === vulnerabilityCodeOne[0] &&
    activeCost === 'medium' &&
    damageProbability === 'high'
  )
    return 'Критично';
  else if (
    dangerousCode === dangerousCodes[0] &&
    vulnerabilityCode === vulnerabilityCodeOne[0] &&
    activeCost === 'smallMedium' &&
    damageProbability === 'high'
  )
    return 'Существенно';
  else if (
    dangerousCode === dangerousCodes[0] &&
    vulnerabilityCode === vulnerabilityCodeOne[0] &&
    activeCost === 'small' &&
    damageProbability === 'high'
  )
    return 'Приемлемо';
  return 'Неопределенно';
};

function App() {
  const [mode, setMode] = useState<'table' | 'form'>('form');

  const [orgName, setOrgName] = useState('');

  //Руководитель органнизации
  const [СEOPosition, setCEOPosition] = useState('Руководитель организации');
  const [CeoFio, setCeoFio] = useState('');
  const [CeoSigned, setCeoSigned] = useState('');

  const [showModal, setShowModal] = useState(false);

  //Руководитель отдела ИБ
  const [headIBPosition, setHeadIBPosition] = useState('Руководитель отдела ИБ');
  const [fioIB, setFioIB] = useState('');
  const [IBSigned, setIBSigned] = useState('');

  //Заместитель руководителя организации
  const [deputyCEOPosition, setDeputyCeoPosition] = useState('Заместитель руководителя организации');
  const [fioDeputyCEO, setFioDeputyCEO] = useState('');
  const [DeputyCEOSigned, setDeputyCEOSigned] = useState('');

  //Председатель совета директоров
  const [chairmanOfTheBoardPosition, setChairmanOfTheBoardPosition] = useState('Председатель совета директоров');
  const [fioChairmanOfTheBoard, setFioChairmanOfTheBoard] = useState('');
  const [ChairmanOfTheBoardSigned, setChairmanOfTheBoardSigned] = useState('');

  const [date, setDate] = useState<Date | null>(new Date());

  const [rows, setRows] = useState<GridRowsProp>([]);

  const hashingCeoSigned = useMemo(() => {
    return md5(CeoFio);
  }, [CeoFio]);

  const hashingDeputyCEOSigned = useMemo(() => {
    return md5(fioDeputyCEO);
  }, [fioDeputyCEO]);

  const hashingIBSigned = useMemo(() => {
    return md5(fioIB);
  }, [fioIB]);

  const hashingChairmanOfTheBoardSigned = useMemo(() => {
    return md5(fioChairmanOfTheBoard);
  }, [fioChairmanOfTheBoard]);

  const [showHashingCeoSigned, setHashingCeoSigned] = useState(false);

  const [showHashingDeputyCEOSigned, setHashingDeputyCEOSigned] = useState(false);

  const [showHashingChairmanOfTheBoardSigned, setHashingChairmanOfTheBoardSigned] = useState(false);

  const [showHashingIBSigned, setHashingIBSigned] = useState(false);

  const handleClose = useCallback(() => setShowModal(false), [setShowModal]);

  const handleSubmit = useCallback((userInfo: UserInfo) => {
    setRows((prevState) => [
      ...prevState,
      {
        id: prevState.length,
        codeDanger: userInfo.dangerCode ?? '--',
        codeStopable: userInfo.vulnerabilityCode ?? '--',
        active: userInfo.activeName ?? '--',
        costActive: userInfo.activeCost?.label ?? '--',
        costThreats: getCostStatus(
          userInfo.dangerCode,
          userInfo.vulnerabilityCode,
          userInfo.activeCost?.value,
          userInfo.damageProbability?.value,
        ),
        realiseVariant: userInfo.damageProbability?.label,
        processingMethod: 'Автоматический',
        costProcessing: 'Экстренный запуск дублирующей ноды',
        assignee: userInfo.employerFio,
      },
    ]);
  }, []);

  return (
    <MainContainer>
      <div>
        {mode === 'form' ? (
          <>
            <ToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => {
                if (value !== undefined) setMode(value);
              }}
              aria-label="Platform"
            >
              <ToggleButton value="form">Форма</ToggleButton>
              <ToggleButton value="table">Таблицы</ToggleButton>
            </ToggleButtonGroup>
            <FormContainer>
              <Typography textAlign="center" variant="h4">
                Риск менеджмент
              </Typography>
              <TextField
                label="Наименование организации"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <TextField
                label="Должность руководителя организации"
                value={СEOPosition}
                onChange={(e) => setCEOPosition(e.target.value)}
              />
              <TextField
                label="ФИО руководителя организации"
                value={CeoFio}
                onChange={(e) => setCeoFio(e.target.value)}
              />

              <TextField
                label="Должность руководителя отдела ИБ"
                value={headIBPosition}
                onChange={(e) => setHeadIBPosition(e.target.value)}
              />
              <TextField label="ФИО руководителя отдела ИБ" value={fioIB} onChange={(e) => setFioIB(e.target.value)} />

              <TextField
                label="Должность заместителя руководителя организации"
                value={deputyCEOPosition}
                onChange={(e) => setDeputyCeoPosition(e.target.value)}
              />
              <TextField
                label="ФИО заместителя руководителя организации"
                value={fioDeputyCEO}
                onChange={(e) => setFioDeputyCEO(e.target.value)}
              />

              <TextField
                label="Должность председателя совета директоров"
                value={chairmanOfTheBoardPosition}
                onChange={(e) => setChairmanOfTheBoardPosition(e.target.value)}
              />
              <TextField
                label="ФИО председателя совета директоров"
                value={fioChairmanOfTheBoard}
                onChange={(e) => setFioChairmanOfTheBoard(e.target.value)}
              />

              <DatePicker value={date} onChange={(value) => setDate(value)} label={'Дата подписания соглашения'} />

              <StyledButton variant="contained" onClick={() => setMode('table')}>
                Отправить
              </StyledButton>
            </FormContainer>
          </>
        ) : (
          <>
            <ToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => {
                if (value !== undefined) setMode(value);
              }}
              aria-label="Platform"
            >
              <ToggleButton value="form">Форма</ToggleButton>
              <ToggleButton value="table">Таблицы</ToggleButton>
            </ToggleButtonGroup>
            <TypographyTitle>
              <Typography>Утверждаю:</Typography>
              <Typography>{СEOPosition}</Typography>
              <Typography>{orgName}</Typography>
              <Typography>{CeoFio}</Typography>
              {date && <Typography>{dateFns.format(date, 'dd.MM.yyyy')}</Typography>}
              {showHashingCeoSigned ? (
                <Typography>{`Подпись: ${hashingCeoSigned}`}</Typography>
              ) : (
                <Button
                  onClick={() => {
                    setHashingCeoSigned(true);
                  }}
                >
                  Подписать
                </Button>
              )}
            </TypographyTitle>
            <TableTitle>
              <Typography>План</Typography>
              <Typography>Обработка рисков по обеспечению непрерывности бизнеса с позиции</Typography>
              <Typography>информационной безопасности</Typography>
            </TableTitle>

            <TableBlock>
              <StyledDataGrid columns={columns} rows={rows} />
              <Button variant={'contained'} onClick={() => setShowModal(true)}>
                <AddIcon />
                <Typography>Запись</Typography>
              </Button>
            </TableBlock>

            <TypographyFooter>
              <Box sx={{ paddingBottom: '15px' }} alignItems="center" display="flex">
                <Typography>{`${headIBPosition}: ${fioIB}`}</Typography>
                {showHashingIBSigned ? (
                  <Typography>{`Подпись: ${hashingIBSigned}`}</Typography>
                ) : (
                  <Button
                    onClick={() => {
                      setHashingIBSigned(true);
                    }}
                  >
                    Подписать
                  </Button>
                )}
              </Box>
              <Typography>Согласовано:</Typography>

              <Typography sx={{ paddingBottom: '5px' }}>{`${deputyCEOPosition}: ${fioDeputyCEO}`}</Typography>
              {showHashingDeputyCEOSigned ? (
                <Typography>{`Подпись: ${hashingDeputyCEOSigned}`}</Typography>
              ) : (
                <Button
                  onClick={() => {
                    setHashingDeputyCEOSigned(true);
                  }}
                >
                  Подписать
                </Button>
              )}

              <Typography sx={{ paddingBottom: '5px' }}>
                {`${chairmanOfTheBoardPosition}: ${fioChairmanOfTheBoard}`}
              </Typography>
              {showHashingChairmanOfTheBoardSigned ? (
                <Typography>{`Подпись: ${hashingChairmanOfTheBoardSigned}`}</Typography>
              ) : (
                <Button
                  onClick={() => {
                    setHashingChairmanOfTheBoardSigned(true);
                  }}
                >
                  Подписать
                </Button>
              )}
            </TypographyFooter>
            <TypographyFooter></TypographyFooter>
          </>
        )}
      </div>
      <AddDangerousModal open={showModal} handleClose={handleClose} onSubmit={handleSubmit} />
    </MainContainer>
  );
}

const AddButton = styled(Button)`
  display: flex;
  gap: 10px;
  width: 200px;
`;

const TableBlock = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const TableTitle = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;

const StyledDataGrid = styled(DataGrid)`
  background-color: white;
  min-height: 192px;
`;

const StyledButton = styled(Button)`
  height: 50px;
  width: 200px;
  margin: 0 auto;
`;

const TypographyTitle = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 15px;
`;

const TypographyFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

const MainContainer = styled(Box)`
  height: 100vh;
  align-items: center;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  display: flex;
  justify-content: space-around;
`;

const FormContainer = styled(Box)`
  width: 600px;
  height: 650px;
  overflow-y: auto;
  padding: 20px;
  border-radius: 6px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default App;
