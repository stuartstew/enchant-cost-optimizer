import { Alert } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import type React from "react";

type Props = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

export const ErrorAlert = ({ title, children }: Props) => (
  <Alert variant="light" color="red" title={title} icon={<IconExclamationCircle />}>
    {children}
  </Alert>
);
