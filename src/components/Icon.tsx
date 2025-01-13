import React from "react";
import * as FaIcon from "react-icons/fa6";
import * as GiIcon from "react-icons/gi";
import { type IconBaseProps } from "react-icons/lib";
import * as LuIcon from "react-icons/lu";
import * as PiIcon from "react-icons/pi";
import * as SiIcon from "react-icons/si";
import { match, P } from "ts-pattern";

export type IconName =
  | keyof typeof SiIcon
  | keyof typeof LuIcon
  | keyof typeof PiIcon
  | keyof typeof GiIcon
  | keyof typeof FaIcon;

export type IconProps = IconBaseProps & {
  name: IconName;
};

export function Icon({ name, size = 24, ...props }: IconProps) {
  const element = match(name)
    .with(P.string.startsWith("Si"), icon => SiIcon[icon])
    .with(P.string.startsWith("Lu"), icon => LuIcon[icon])
    .with(P.string.startsWith("Pi"), icon => PiIcon[icon])
    .with(P.string.startsWith("Fa"), icon => FaIcon[icon])
    .with(P.string.startsWith("Gi"), icon => GiIcon[icon])
    .otherwise(() => React.Fragment);

  return React.createElement(element, { size, ...props });
}
