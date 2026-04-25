import { Group } from "@mantine/core";
import { Disclaimer } from "./disclaimer";
import { GithubLink } from "./github-link";

export const Footer = () => {
  return (
    <Group h="100%" px="sm" justify="space-between">
      <GithubLink />
      <Disclaimer />
    </Group>
  );
};
