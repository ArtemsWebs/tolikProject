import { Autocomplete, Box, Button, Modal, styled, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { DefaultOption, UserInfo } from '../types/SharedTypes';
import {
  costActive,
  costActiveName,
  dangerousCodes,
  dangerousVariabilityName,
  dangerousVariabilityStatus,
  vulnerabilityCodeOne,
  vulnerabilityCodeTwo,
} from '../utils/const';
import { getOptionForArray } from '../utils/utils';

interface AddDangerousModalProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (userInfo: UserInfo) => void;
}

const costActiveOptions = getOptionForArray<typeof costActive, typeof costActiveName>(costActive, costActiveName);

const damageProbabilityOptions = getOptionForArray<typeof dangerousVariabilityStatus, typeof dangerousVariabilityName>(
  dangerousVariabilityStatus,
  dangerousVariabilityName,
);

const codeDangerousOptions = getOptionForArray<typeof dangerousCodes, typeof dangerousCodes>(
  dangerousCodes,
  dangerousCodes,
);

const AddDangerousModal = ({ open, handleClose, onSubmit }: AddDangerousModalProps) => {
  const [activeName, setActiveName] = useState('');

  //Ценность актива
  const [assetVulnerability, setAssetVulnerability] = useState<DefaultOption | null>(null);
  //код уязвимости
  const [vulnerabilityCode, setVulnerabilityCode] = useState<DefaultOption | null>(null);
  //код угрозы
  const [codeDangerous, setCodeDangerous] = useState<DefaultOption | null>(null);
  //вероятность ущерба
  const [damageProbability, setDamagePropability] = useState<DefaultOption | null>(null);

  const actualVulnerabilityOptions = useMemo(() => {
    if (codeDangerous?.value === dangerousCodes[0])
      return getOptionForArray<typeof vulnerabilityCodeOne, typeof vulnerabilityCodeOne>(
        vulnerabilityCodeOne,
        vulnerabilityCodeOne,
      );
    return getOptionForArray<typeof vulnerabilityCodeTwo, typeof vulnerabilityCodeTwo>(
      vulnerabilityCodeTwo,
      vulnerabilityCodeTwo,
    );
  }, [codeDangerous]);

  useEffect(() => {
    if (codeDangerous?.value) setVulnerabilityCode(actualVulnerabilityOptions[0]);
  }, [codeDangerous, actualVulnerabilityOptions]);

  const [employ, setEmploy] = useState('');
  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ContentPosition>
        <Typography variant="h4">Создание угрозы</Typography>
        <FormBlock>
          <TextField label="Название актива" value={activeName} onChange={(e) => setActiveName(e.target.value)} />
          <Autocomplete
            value={assetVulnerability}
            options={costActiveOptions}
            getOptionLabel={(value) => value?.label}
            onChange={(_, value) => setAssetVulnerability(value)}
            renderInput={(props) => <TextField {...props} label="Ценность актива" />}
          />
          <Autocomplete
            value={codeDangerous}
            options={codeDangerousOptions}
            getOptionLabel={(value) => value?.label}
            onChange={(_, value) => setCodeDangerous(value)}
            renderInput={(props) => <TextField {...props} label="Код угрозы" />}
          />
          {codeDangerous && (
            <Autocomplete
              value={vulnerabilityCode}
              options={actualVulnerabilityOptions}
              getOptionLabel={(value) => value?.label}
              onChange={(_, value) => setVulnerabilityCode(value)}
              renderInput={(props) => <TextField {...props} label="Код уязвимости " />}
            />
          )}
          <Autocomplete
            value={damageProbability}
            options={damageProbabilityOptions}
            getOptionLabel={(value) => value?.label}
            onChange={(_, value) => setDamagePropability(value)}
            renderInput={(props) => <TextField {...props} label="Вероятность ущерба " />}
          />
          <TextField label="Фио ответственного" value={employ} onChange={(e) => setEmploy(e.target.value)} />
        </FormBlock>
        <ButtonBlock>
          <Button variant="contained" onClick={() => handleClose()}>
            Отменить
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onSubmit({
                activeName,
                activeCost: assetVulnerability,
                vulnerabilityCode: vulnerabilityCode?.value ?? '--',
                employerFio: employ,
                dangerCode: codeDangerous?.value ?? '--',
                damageProbability: damageProbability,
              });
              handleClose();
            }}
          >
            Создать
          </Button>
        </ButtonBlock>
      </ContentPosition>
    </StyledModal>
  );
};

const ContentPosition = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  padding: 20px 40px;
  border-radius: 4px;
  display: flex;
  gap: 25px;
  flex-direction: column;
`;

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
`;

const FormBlock = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonBlock = styled(Box)`
  display: flex;
  gap: 15px;
`;

export default AddDangerousModal;
