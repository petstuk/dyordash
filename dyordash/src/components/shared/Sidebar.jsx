import React from 'react'
import classNames from 'classnames'
import { GoRocket } from "react-icons/go"
import { Link, useLocation } from 'react-router-dom'
import { useTicker } from '../routing/TickerContext';
import { generateNavigationLinks } from '../../lib/constants/navigation';
import { HiOutlineLogout } from 'react-icons/hi'

const linkClasses = "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-300 hover:no-underline active:bg-neutral-700 rounded-sm text-base"

export default function Sidebar() {
    const { currentTicker } = useTicker();
    const { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } = generateNavigationLinks(currentTicker);
    
    return (
        <div className="bg-neutral-100 w-60 p-3 flex flex-col text-neutral-700 border-r border-neutral-400">
            {/* Wrap the dyorDash text and GoRocket icon in a Link component */}
            <Link to="/" className="flex items-center gap-2 px-1 py-3 text-neutral-900" style={{textDecoration: 'none',}}>
                <span className="text-xl font-mont font-bold px-2 py-2">dyorDash</span>
                <GoRocket fontSize={24} />
            </Link>
            <div className="flex-1 py-8 flex flex-col gap-0.5">
                {DASHBOARD_SIDEBAR_LINKS.map((item)=>(
                    <SidebarLink key={item.key} item={item} />
                ))}
            </div>
            <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-400">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item)=>(
                    <SidebarLink key={item.key} item={item} />
                ))}
                <div className={classNames('text-neutral-900 cursor-pointer' , linkClasses)}>
                        <span className="text-xl">
                            <HiOutlineLogout />
                        </span>
                    Logout
                </div>
            </div>
        </div>
    )
}

function SidebarLink({ item }) {
    const { pathname } = useLocation()

    return(
        <Link to={item.path} className={classNames(pathname === item.path ? 'bg-neutral-300 text-neutral-700' : 'text-neutral-500' , linkClasses)}>
            <span className='text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
}