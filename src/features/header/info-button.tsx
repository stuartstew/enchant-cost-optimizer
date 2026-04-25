import { ActionIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

type Props = {
  onClick: () => void;
};

export const InfoButton = ({ onClick }: Props) => {
  return (
    <ActionIcon variant="default" size="lg" aria-label="Pick Language" onClick={onClick}>
      <IconInfoCircle style={{ height: "70%", width: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
};
