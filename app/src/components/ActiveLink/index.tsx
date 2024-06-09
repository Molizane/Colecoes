import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
//import { GoTriangleRight } from 'react-icons/go'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  className?: string;
  activeClassName: string;
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const clsName = asPath === rest.href ? activeClassName : className;
  //const triangle = asPath === rest.href ? <GoTriangleRight /> : null;

  return (
    <>
      {/* {triangle} */}
      <Link legacyBehavior {...rest}>
        {cloneElement(children, {
          className: clsName,
        })}
      </Link>
    </>
  );
}
