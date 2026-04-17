'use client'

import { motion } from 'framer-motion'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Layers, ExternalLink, Globe, Database, Server, 
  Cpu, Share2, Box, Shield, Zap, ArrowRight,
  Layout, Network, HardDrive, Infinity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const DESIGN_TOPICS = [
  {
    title: 'Load Balancing',
    icon: Network,
    description: 'Distribute traffic across multiple servers to ensure high availability.',
    difficulty: 'Intermediate',
    keyConcepts: ['Round Robin', 'Least Connections', 'IP Hash'],
    resource: 'https://github.com/donnemartin/system-design-primer#load-balancer'
  },
  {
    title: 'Caching Strategies',
    icon: Zap,
    description: 'Optimize data retrieval speed using Redis, Memcached, and CDN.',
    difficulty: 'Intermediate',
    keyConcepts: ['Write-through', 'Write-back', 'LRU Eviction'],
    resource: 'https://github.com/donnemartin/system-design-primer#cache'
  },
  {
    title: 'Database Sharding',
    icon: Database,
    description: 'Horizontal scaling of databases for massive datasets.',
    difficulty: 'Advanced',
    keyConcepts: ['Consistent Hashing', 'Range Sharding', 'Replication'],
    resource: 'https://github.com/donnemartin/system-design-primer#database'
  },
  {
    title: 'Microservices',
    icon: Box,
    description: 'Decomposing monolithic applications into independent services.',
    difficulty: 'Advanced',
    keyConcepts: ['API Gateway', 'Service Discovery', 'Event-Driven'],
    resource: 'https://microservices.io/'
  },
  {
    title: 'Message Queues',
    icon: Infinity,
    description: 'Asynchronous communication between services using Kafka or RabbitMQ.',
    difficulty: 'Intermediate',
    keyConcepts: ['Pub/Sub', 'Message Durability', 'Backpressure'],
    resource: 'https://github.com/donnemartin/system-design-primer#asynchronous-workflows'
  },
  {
    title: 'System Security',
    icon: Shield,
    description: 'Protecting distributed systems against common vulnerabilities.',
    difficulty: 'Intermediate',
    keyConcepts: ['OAuth2', 'Rate Limiting', 'Encryption at Rest'],
    resource: 'https://github.com/donnemartin/system-design-primer#security'
  }
]

export default function SystemDesignPage() {
  return (
    <StudentDashboardLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" /> Architecture Studio
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
            >
                System <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Design</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed"
            >
              Master the art of building scalable, reliable distributed systems. From high-level architecture to low-level implementation.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-background/40 backdrop-blur-xl p-2 rounded-[2rem] border border-border/40 shadow-xl"
          >
            <Button 
              className="rounded-full h-14 px-8 font-black gap-3 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 transition-all group"
              onClick={() => window.open('https://bytebytego.com/', '_blank')}
            >
              <Globe className="w-5 h-5" />
              ByteByteGo
              <ExternalLink className="w-4 h-4 opacity-50" />
            </Button>
          </motion.div>
        </div>

        {/* Learning Paths */}
        <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                        <Server className="w-6 h-6 text-blue-600" /> Infrastructure Components
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {DESIGN_TOPICS.map((topic, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <Card className="border-2 border-border/30 bg-background/50 backdrop-blur-xl rounded-[2.5rem] hover:border-blue-500/20 transition-all group overflow-hidden h-full flex flex-col">
                                <CardHeader className="p-8 pb-4">
                                    <div className="p-3 w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                                        <topic.icon className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-2xl font-black tracking-tight">{topic.title}</CardTitle>
                                            <Badge className="bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase tracking-widest">{topic.difficulty}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                            {topic.description}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {topic.keyConcepts.map((concept, j) => (
                                            <span key={j} className="text-[10px] font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground">{concept}</span>
                                        ))}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="w-full rounded-xl h-12 font-black text-xs gap-2 border-border/60 hover:bg-blue-500 hover:text-white transition-all"
                                        onClick={() => window.open(topic.resource, '_blank')}
                                    >
                                        Deep Dive <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                {/* Case Studies */}
                <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                     <div className="absolute -bottom-10 -left-10 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <Layout size={200} fill="white" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Real-World Architectures</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Designing Netflix', url: 'https://netflixtechblog.com/' },
                                { name: 'Twitter Timeline', url: 'https://blog.twitter.com/engineering/en_us' },
                                { name: 'Uber Marketplace', url: 'https://eng.uber.com/' }
                            ].map((study, i) => (
                                <button 
                                    key={i}
                                    onClick={() => window.open(study.url, '_blank')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold"
                                >
                                    {study.name}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Primary Resource */}
                <Card className="border-2 border-border/30 bg-background/50 backdrop-blur-xl rounded-[2.5rem] p-8 space-y-6">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">Essential Reading</h4>
                    <div className="space-y-6">
                        <div className="group cursor-pointer" onClick={() => window.open('https://github.com/donnemartin/system-design-primer', '_blank')}>
                            <p className="text-base font-black group-hover:text-blue-600 transition-colors">System Design Primer</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">The most comprehensive collection of resources for learning system design.</p>
                        </div>
                        <div className="group cursor-pointer" onClick={() => window.open('https://highscalability.com/', '_blank')}>
                            <p className="text-base font-black group-hover:text-blue-600 transition-colors">High Scalability</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">Articles and case studies on how the worlds largest systems are built.</p>
                        </div>
                    </div>
                </Card>

                {/* Performance Kit */}
                <div className="p-8 rounded-[2.5rem] bg-muted/30 border-2 border-border/10 space-y-4">
                    <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-black text-sm uppercase tracking-widest">Architect Tooling</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 rounded-xl bg-background border border-border/60 text-[10px] font-black hover:border-blue-500 transition-all" onClick={() => window.open('https://excalidraw.com/', '_blank')}>EXCALIDRAW</button>
                        <button className="p-3 rounded-xl bg-background border border-border/60 text-[10px] font-black hover:border-blue-500 transition-all" onClick={() => window.open('https://draw.io/', '_blank')}>DRAW.IO</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
