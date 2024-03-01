import { ReactElement, cloneElement } from 'react';
import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import { GoTriangleRight } from 'react-icons/go'

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter();
    const className = asPath === rest.href ? activeClassName : "";
    const triangle = asPath === rest.href ? <GoTriangleRight /> : null;

    return (
        <>
            {/* {triangle} */}
            <Link legacyBehavior {...rest}>
                {
                    cloneElement(children, {
                        className
                    })
                }
            </Link>
        </>
    )
}