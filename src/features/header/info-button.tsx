import { ActionIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export const InfoButton = () => {
  return (
    <ActionIcon variant="default" size="lg" aria-label="Pick Language">
      <IconInfoCircle style={{ height: "70%", width: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
};
