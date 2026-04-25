import { List, Modal, Text, Title } from "@mantine/core";
import { Trans, useTranslation } from "react-i18next";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const InfoModal = ({ opened, onClose }: Props) => {
  const { t } = useTranslation();
  const title = <Title order={4}>{t("title")}</Title>;

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Text>{t("info.description")}</Text>
      <List type="ordered" mt="md">
        <List.Item>{t("info.step1")}</List.Item>
        <List.Item>{t("info.step2")}</List.Item>
        <List.Item>{t("info.step3")}</List.Item>
      </List>
      <Text mt="md">
        <Trans i18nKey="info.assumption" />
      </Text>
    </Modal>
  );
};
