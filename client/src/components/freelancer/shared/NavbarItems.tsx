import { Briefcase, FileText, LayoutDashboard, MessageSquare, ScrollText, Wallet } from "lucide-react";


export const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Find Jobs', id: 'jobs', path: '/freelancer/jobs' },
    { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/freelancer/proposals' },
    { icon: <ScrollText className="h-5 w-5" />, label: 'Contracts', id: 'contracts', path: '/freelancer/contracts' },
    // { icon: <Clock className="h-5 w-5" />, label: 'Active Jobs', id: 'active' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
    { icon: <Wallet className="h-5 w-5" />, label: 'Earnings', id: 'earnings' },
  ];