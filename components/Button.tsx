import { Button as ButtonComponent } from "@/components/ui/button"
import Link from "next/link"
import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}


export default function Button({ children, href, onClick, variant, size }: ButtonProps) {
    
    if (href) {
        return (
            <Link href={href}>
                <ButtonComponent>{children}</ButtonComponent>
            </Link>
        )
    }

    if (onClick) {
        return (
            <ButtonComponent onClick={onClick}>{children}</ButtonComponent>
        )
    }
    return (
        <ButtonComponent>
            {children}
        </ButtonComponent>
    )
}
