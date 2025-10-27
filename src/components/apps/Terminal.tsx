
import React, { useState, useRef, useEffect } from 'react';

interface CommandHistory {
  command: string;
  output: string;
}

interface FileSystem {
  [key: string]: string[] | FileSystem;
}

const FILE_SYSTEM: FileSystem = {
  home: {
    devops: ['Documents', 'Downloads', 'Pictures', 'Videos', 'projects', 'scripts', 'kubernetes', 'terraform', 'ansible', '.config', '.bashrc', '.gitconfig'],
  },
  var: {
    log: ['nginx', 'syslog', 'kern.log'],
    www: ['html'],
  },
  etc: ['nginx', 'docker', 'systemd', 'ssh'],
  usr: {
    bin: ['docker', 'kubectl', 'git', 'terraform', 'ansible'],
    lib: ['systemd'],
  },
};

const COMMAND_RESPONSES: Record<string, string> = {
  help: `Available commands:
  Docker:          docker ps, docker images, docker logs, docker exec, docker-compose up
  Kubernetes:      kubectl get pods/nodes/services, kubectl describe, kubectl logs, kubectl top
  System:          systemctl status/start/stop, top, htop, ps aux, free, df
  Monitoring:      netstat, ss, iftop, iostat, vmstat, uptime
  Git:             git status, git log, git branch
  Terraform:       terraform plan, terraform apply, terraform destroy
  Ansible:         ansible-playbook, ansible-vault
  CI/CD:           jenkins status, gitlab-runner status
  Files:           ls, pwd, cd, cd.., cat, find, grep
  Network:         ping, curl, wget, traceroute, nslookup
  Other:           whoami, neofetch, clear, help`,
  
  'docker ps': `CONTAINER ID   IMAGE                    COMMAND                  STATUS         PORTS                    NAMES
a1b2c3d4e5f6   nginx:latest             "nginx -g daemon..."     Up 2 hours     0.0.0.0:80->80/tcp       web-server
9f8e7d6c5b4a   postgres:14              "docker-entrypoint..."   Up 5 hours     0.0.0.0:5432->5432/tcp   db-primary
3c4d5e6f7a8b   redis:alpine             "redis-server"           Up 3 days      0.0.0.0:6379->6379/tcp   cache
7b8c9d0e1f2a   prometheus:latest        "/bin/prometheus..."     Up 10 days     0.0.0.0:9090->9090/tcp   monitoring
2c3d4e5f6a7b   grafana/grafana:latest   "/run.sh"                Up 10 days     0.0.0.0:3000->3000/tcp   grafana`,
  
  'docker images': `REPOSITORY          TAG        IMAGE ID       CREATED        SIZE
nginx               latest     a1b2c3d4e5f6   2 weeks ago    142MB
postgres            14         9f8e7d6c5b4a   3 weeks ago    376MB
redis               alpine     3c4d5e6f7a8b   1 month ago    32MB
ubuntu              22.04      7d8e9f0a1b2c   2 months ago   77MB
prometheus          latest     5d6e7f8a9b0c   1 week ago     185MB
grafana/grafana     latest     6e7f8a9b0c1d   2 weeks ago    254MB`,

  'docker logs nginx': `2024/01/20 10:30:15 [notice] 1#1: nginx/1.25.3
2024/01/20 10:30:15 [notice] 1#1: built by gcc 12.2.1
2024/01/20 10:30:15 [notice] 1#1: OS: Linux 5.15.0-91-generic
2024/01/20 10:30:15 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2024/01/20 10:30:15 [notice] 1#1: start worker processes
192.168.1.100 - - [20/Jan/2024:10:31:23 +0000] "GET / HTTP/1.1" 200 612
192.168.1.101 - - [20/Jan/2024:10:32:45 +0000] "GET /api/health HTTP/1.1" 200 15`,

  'docker exec -it db-primary bash': `root@9f8e7d6c5b4a:/# `,

  'docker-compose up': `Creating network "app_default" with the default driver
Creating volume "app_postgres_data" with default driver
Creating app_db_1    ... done
Creating app_redis_1 ... done
Creating app_web_1   ... done
Attaching to app_db_1, app_redis_1, app_web_1`,
  
  'kubectl get pods': `NAME                                READY   STATUS    RESTARTS   AGE
frontend-deployment-7d8f9c-x4p2n    1/1     Running   0          2d
backend-deployment-9c7f8d-j9k3m     1/1     Running   1          5d
database-deployment-5b6c7d-m8n2k    1/1     Running   0          10d
redis-deployment-3a4b5c-p7q6r       1/1     Running   0          15d
monitoring-deployment-8e9f0a-s5t4k  1/1     Running   0          20d`,

  'kubectl get nodes': `NAME           STATUS   ROLES           AGE   VERSION
node-master    Ready    control-plane   45d   v1.28.4
node-worker-1  Ready    <none>          45d   v1.28.4
node-worker-2  Ready    <none>          45d   v1.28.4
node-worker-3  Ready    <none>          44d   v1.28.4`,

  'kubectl get services': `NAME              TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
kubernetes        ClusterIP      10.96.0.1       <none>         443/TCP        45d
frontend-svc      LoadBalancer   10.96.45.23     52.23.45.67    80:30080/TCP   40d
backend-svc       ClusterIP      10.96.78.91     <none>         8080/TCP       40d
database-svc      ClusterIP      10.96.123.45    <none>         5432/TCP       40d`,

  'kubectl describe pod frontend-deployment-7d8f9c-x4p2n': `Name:         frontend-deployment-7d8f9c-x4p2n
Namespace:    default
Priority:     0
Node:         node-worker-1/192.168.1.101
Start Time:   Mon, 18 Jan 2024 10:30:00 +0000
Status:       Running
IP:           10.244.1.23
Containers:
  frontend:
    Image:          myapp/frontend:v2.3.1
    Port:           3000/TCP
    State:          Running
    Ready:          True
    Restart Count:  0`,

  'kubectl logs frontend-deployment-7d8f9c-x4p2n': `[2024-01-20T10:30:15.234Z] INFO: Server started on port 3000
[2024-01-20T10:30:16.891Z] INFO: Connected to database
[2024-01-20T10:31:23.456Z] INFO: Received GET request to /api/users
[2024-01-20T10:31:23.678Z] INFO: Response sent successfully`,

  'kubectl top nodes': `NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
node-master    245m         12%    2048Mi          25%
node-worker-1  890m         44%    6144Mi          76%
node-worker-2  1230m        61%    7168Mi          89%
node-worker-3  670m         33%    4096Mi          51%`,

  'kubectl top pods': `NAME                                CPU(cores)   MEMORY(bytes)
frontend-deployment-7d8f9c-x4p2n    15m          128Mi
backend-deployment-9c7f8d-j9k3m     45m          512Mi
database-deployment-5b6c7d-m8n2k    89m          1024Mi
redis-deployment-3a4b5c-p7q6r       12m          64Mi`,
  
  'systemctl status nginx': `● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Mon 2024-01-15 10:31:23 UTC; 5 days ago
     Docs: https://nginx.org/en/docs/
  Process: 1234 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
 Main PID: 1235 (nginx)
    Tasks: 5 (limit: 4915)
   Memory: 45.2M
   CGroup: /system.slice/nginx.service
           ├─1235 nginx: master process /usr/sbin/nginx
           └─1236 nginx: worker process`,

  'systemctl status docker': `● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled)
   Active: active (running) since Mon 2024-01-15 09:15:42 UTC; 5 days ago
     Docs: https://docs.docker.com
 Main PID: 856 (dockerd)
    Tasks: 42
   Memory: 156.8M
   CGroup: /system.slice/docker.service
           └─856 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock`,

  'systemctl start nginx': `Starting nginx.service...
Started nginx.service - A high performance web server.`,

  'systemctl stop nginx': `Stopping nginx.service...
Stopped nginx.service - A high performance web server.`,
  
  top: `top - 10:45:23 up 5 days, 12:15,  2 users,  load average: 0.52, 0.58, 0.59
Tasks: 245 total,   1 running, 244 sleeping,   0 stopped,   0 zombie
%Cpu(s):  8.3 us,  2.1 sy,  0.0 ni, 89.1 id,  0.3 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :  16384.0 total,   2048.5 free,   8192.3 used,   6143.2 buff/cache
MiB Swap:   8192.0 total,   7168.0 free,   1024.0 used.   7340.2 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1235 www-data  20   0  125648  45236  12456 S   5.3   0.3   2:15.67 nginx
 2341 postgres  20   0 1234567 512345  89012 S   3.2   3.1  12:45.89 postgres
 3456 root      20   0  789012 156789  23456 S   2.1   1.0   5:23.45 dockerd`,

  htop: `  1  [|||||||||||||||||||||||||||||||||||||||||||||||||||   52.3%]
  2  [|||||||||||||||||||||||||||||||||||||               38.7%]
  3  [||||||||||||||||||||||||||||||||||||||||||||||      45.9%]
  4  [||||||||||||||||||||||||||||||||                    32.1%]
  Mem[|||||||||||||||||||||||||||||||||||          8.0G/16.0G]
  Swp[||||                                         1.0G/8.0G]

  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
 1235 www-data   20   0  125M  45.2M 12.4M S  5.3  0.3  2:15.67 nginx: master process
 2341 postgres   20   0 1234M  512M  89.0M S  3.2  3.1 12:45.89 /usr/lib/postgresql/14/bin/postgres`,

  'ps aux': `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169416 11232 ?        Ss   Jan15   0:12 /sbin/init
root       856  0.5  0.9 1567890 156789 ?      Ssl  Jan15  15:34 /usr/bin/dockerd
www-data  1235  0.3  0.2 125648 45236 ?        S    Jan15   2:15 nginx: master process
postgres  2341  0.8  3.1 1234567 512345 ?      Ss   Jan15  12:45 /usr/lib/postgresql/14/bin/postgres
root      3456  0.1  0.5 789012 89012 ?        Sl   Jan15   5:23 /usr/bin/containerd`,

  free: `              total        used        free      shared  buff/cache   available
Mem:       16777216     8388608     2097152      524288     6291456     7516192
Swap:       8388608     1048576     7340032`,

  df: `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1      512000000 120000000 366400000  25% /
tmpfs            8388608         0   8388608   0% /dev/shm
/dev/sda2      256000000  89600000 153600000  37% /var
/dev/sdb1     1024000000 307200000 665600000  32% /data`,

  uptime: `10:45:23 up 5 days, 12:15,  2 users,  load average: 0.52, 0.58, 0.59`,

  'netstat -tulpn': `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1235/nginx
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      1235/nginx
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      2341/postgres
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      3456/redis-server`,

  'ss -tulpn': `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      128    0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=1234,fd=3))
tcp   LISTEN 0      511    0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=1235,fd=6))
tcp   LISTEN 0      511    0.0.0.0:443         0.0.0.0:*     users:(("nginx",pid=1235,fd=7))
tcp   LISTEN 0      128    127.0.0.1:5432      0.0.0.0:*     users:(("postgres",pid=2341,fd=5))`,

  iostat: `avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           8.32    0.00    2.15    0.34    0.00   89.19

Device             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sda              45.23       256.78      1234.56   12345678   56789012
sdb              23.45       128.34       567.89    6543210   28901234`,

  vmstat: `procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0 1048576 2097152 524288 6291456  0    0   256  1234 1234 2345  8  2 89  1  0`,

  'git status': `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/components/app.tsx
        modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/components/new-feature.tsx

no changes added to commit (use "git add" and/or "git commit -a")`,

  'git log': `commit a1b2c3d4e5f6789012345678901234567890abcd (HEAD -> main, origin/main)
Author: DevOps Engineer <devops@example.com>
Date:   Mon Jan 15 10:30:00 2024 +0000

    feat: add monitoring dashboard integration

commit 9f8e7d6c5b4a3210fedcba0987654321fedcba09
Author: DevOps Engineer <devops@example.com>
Date:   Sun Jan 14 15:45:23 2024 +0000

    fix: resolve container networking issues

commit 7b6c5a4d3e2f1089fedcba9876543210fedcba87
Author: DevOps Engineer <devops@example.com>
Date:   Sat Jan 13 09:15:42 2024 +0000

    chore: update kubernetes manifests`,

  'git branch': `* main
  develop
  feature/monitoring
  feature/ci-cd-pipeline
  hotfix/security-patch`,

  'terraform plan': `Refreshing Terraform state in-memory prior to plan...

Terraform will perform the following actions:

  # aws_instance.web_server will be created
  + resource "aws_instance" "web_server" {
      + ami                          = "ami-0c55b159cbfafe1f0"
      + instance_type                = "t3.medium"
      + key_name                     = "devops-key"
      + tags                         = {
          + "Name" = "web-server-prod"
        }
    }

  # aws_security_group.web_sg will be created
  + resource "aws_security_group" "web_sg" {
      + name        = "web-server-sg"
      + description = "Security group for web server"
    }

Plan: 2 to add, 0 to change, 0 to destroy.`,

  'terraform apply': `aws_security_group.web_sg: Creating...
aws_security_group.web_sg: Creation complete after 3s [id=sg-0a1b2c3d4e5f6]
aws_instance.web_server: Creating...
aws_instance.web_server: Still creating... [10s elapsed]
aws_instance.web_server: Still creating... [20s elapsed]
aws_instance.web_server: Creation complete after 25s [id=i-0a1b2c3d4e5f6g7h8]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.`,

  'terraform destroy': `aws_instance.web_server: Refreshing state... [id=i-0a1b2c3d4e5f6g7h8]
aws_security_group.web_sg: Refreshing state... [id=sg-0a1b2c3d4e5f6]

Terraform will perform the following actions:

  # aws_instance.web_server will be destroyed
  # aws_security_group.web_sg will be destroyed

Plan: 0 to add, 0 to change, 2 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  Type 'yes' to confirm: yes

Destroy complete! Resources: 2 destroyed.`,

  'ansible-playbook deploy.yml': `PLAY [Deploy Application] **********************************************

TASK [Gathering Facts] *************************************************
ok: [web-server-1]
ok: [web-server-2]

TASK [Update apt cache] ************************************************
changed: [web-server-1]
changed: [web-server-2]

TASK [Install Docker] **************************************************
ok: [web-server-1]
ok: [web-server-2]

TASK [Deploy application container] ************************************
changed: [web-server-1]
changed: [web-server-2]

PLAY RECAP *************************************************************
web-server-1               : ok=4    changed=2    unreachable=0    failed=0
web-server-2               : ok=4    changed=2    unreachable=0    failed=0`,

  'ansible-vault encrypt secrets.yml': `New Vault password: 
Confirm New Vault password: 
Encryption successful`,

  'jenkins status': `Jenkins is running
Version: 2.426.2
URL: http://jenkins.example.com:8080
Active jobs: 12
Queue length: 3
Executors: 8 (5 busy, 3 idle)`,

  'gitlab-runner status': `Runtime platform                                    arch=amd64 os=linux
Running in system-mode.

Configuration loaded from /etc/gitlab-runner/config.toml

Status: active
Runners: 4
  - runner-1: active, tags: docker,kubernetes
  - runner-2: active, tags: terraform,aws
  - runner-3: active, tags: ansible,deploy
  - runner-4: active, tags: test,integration`,

  pwd: `/home/devops`,
  
  'cat /etc/os-release': `NAME="Ubuntu"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 22.04.3 LTS"
VERSION_ID="22.04"
VERSION_CODENAME=jammy`,

  'find / -name "*.conf" -type f': `/etc/nginx/nginx.conf
/etc/docker/daemon.json
/etc/systemd/system.conf
/etc/ssh/sshd_config
/etc/postgresql/14/main/postgresql.conf`,

  'grep -r "error" /var/log/': `/var/log/nginx/error.log:2024/01/20 10:15:23 [error] 1235#1235: connection refused
/var/log/syslog:Jan 20 10:15:45 server kernel: [12345.678901] Out of memory: Kill process 5678`,

  'ping google.com': `PING google.com (142.250.185.46) 56(84) bytes of data.
64 bytes from lhr25s34-in-f14.1e100.net (142.250.185.46): icmp_seq=1 ttl=118 time=10.2 ms
64 bytes from lhr25s34-in-f14.1e100.net (142.250.185.46): icmp_seq=2 ttl=118 time=9.87 ms
64 bytes from lhr25s34-in-f14.1e100.net (142.250.185.46): icmp_seq=3 ttl=118 time=10.1 ms
--- google.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 9.870/10.057/10.200/0.139 ms`,

  'curl -I https://example.com': `HTTP/2 200
content-type: text/html; charset=UTF-8
server: nginx/1.25.3
date: Sat, 20 Jan 2024 10:30:15 GMT
cache-control: max-age=3600
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff`,

  'wget https://example.com/file.tar.gz': `--2024-01-20 10:30:15--  https://example.com/file.tar.gz
Resolving example.com (example.com)... 93.184.216.34
Connecting to example.com (example.com)|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 10485760 (10M) [application/gzip]
Saving to: 'file.tar.gz'

file.tar.gz         100%[===================>]  10.00M  5.23MB/s    in 1.9s

2024-01-20 10:30:17 (5.23 MB/s) - 'file.tar.gz' saved [10485760/10485760]`,

  'traceroute google.com': `traceroute to google.com (142.250.185.46), 30 hops max, 60 byte packets
 1  gateway (192.168.1.1)  1.234 ms  1.156 ms  1.089 ms
 2  isp-router.net (10.20.30.40)  5.678 ms  5.567 ms  5.456 ms
 3  core-router-1.isp.net (52.123.45.67)  10.234 ms  10.123 ms  10.012 ms
 4  peer-exchange.net (93.184.216.1)  15.345 ms  15.234 ms  15.123 ms
 5  google-peer.net (142.250.185.1)  18.456 ms  18.345 ms  18.234 ms
 6  lhr25s34-in-f14.1e100.net (142.250.185.46)  19.567 ms  19.456 ms  19.345 ms`,

  'nslookup google.com': `Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.185.46
Name:   google.com
Address: 2a00:1450:4009:815::200e`,
  
  whoami: `Megh Vyas`,
  
  neofetch: `\x1b[38;5;208m                          \x1b[1;37mMeghVyas\x1b[0m@\x1b[1;37mportfolio\x1b[0m
\x1b[38;5;208m              .-/+oossssoo+/-.               \x1b[0m\x1b[0;36mOS:\x1b[0m Ubuntu 22.04 LTS x86_64
\x1b[38;5;208m          \`:+ssssssssssssssssss+:\`           \x1b[0m\x1b[0;36mHost:\x1b[0m Production Server
\x1b[38;5;208m        -+ssssssssssssssssssyyssss+-         \x1b[0m\x1b[0;36mKernel:\x1b[0m 5.15.0-91-generic
\x1b[38;5;208m      .ossssssssssssssssssd\x1b[1;37mMM\x1b[38;5;208mMysssso.       \x1b[0m\x1b[0;36mUptime:\x1b[0m 5 days, 12 hours
\x1b[38;5;208m     /sssssssssss\x1b[1;37mhd\x1b[38;5;208mysso++os\x1b[1;37myMM\x1b[38;5;208mdysssss/      \x1b[0m\x1b[0;36mPackages:\x1b[0m 2847 (dpkg)
\x1b[38;5;208m    /ssssssssss\x1b[1;37mhm\x1b[38;5;208mysso++os\x1b[1;37myMMN\x1b[38;5;208mm\x1b[1;37md\x1b[38;5;208mhssssss/     \x1b[0m\x1b[0;36mShell:\x1b[0m bash 5.1.16
\x1b[38;5;208m   .sssssssss\x1b[1;37mhMM\x1b[38;5;208mmyo++os\x1b[1;37myMMMMm\x1b[38;5;208mm\x1b[1;37md\x1b[38;5;208mhssssss.    \x1b[0m\x1b[0;36mTerminal:\x1b[0m xterm-256color
\x1b[38;5;208m   +sss\x1b[1;37mhh\x1b[38;5;208mhsssss\x1b[1;37myyy\x1b[38;5;208msssss\x1b[1;37myMMM\x1b[38;5;208my\x1b[1;37mdd\x1b[38;5;208mhssssss+    \x1b[0m\x1b[0;36mCPU:\x1b[0m Intel Xeon (8) @ 3.2GHz
\x1b[38;5;208m   oss\x1b[1;37myNM\x1b[38;5;208mmssssss\x1b[1;37mdMM\x1b[38;5;208mmssssss\x1b[1;37mhMM\x1b[38;5;208mmdyysssso    \x1b[0m\x1b[0;36mGPU:\x1b[0m VMware SVGA II
\x1b[38;5;208m   oss\x1b[1;37myNM\x1b[38;5;208mmssssss\x1b[1;37mdMM\x1b[38;5;208mmssssss\x1b[1;37mhMM\x1b[38;5;208mmdyysssso    \x1b[0m\x1b[0;36mMemory:\x1b[0m 8192MB / 16384MB
\x1b[38;5;208m   +sss\x1b[1;37mhh\x1b[38;5;208mhsssss\x1b[1;37myyy\x1b[38;5;208msssss\x1b[1;37myMMM\x1b[38;5;208my\x1b[1;37mdd\x1b[38;5;208mhssssss+    \x1b[0m\x1b[0;36mDisk:\x1b[0m 120GB / 500GB
\x1b[38;5;208m   .sssssssss\x1b[1;37mhMM\x1b[38;5;208mmyo++os\x1b[1;37myMMMMm\x1b[38;5;208mm\x1b[1;37md\x1b[38;5;208mhssssss.    \x1b[0m
\x1b[38;5;208m    /ssssssssss\x1b[1;37mhm\x1b[38;5;208mysso++os\x1b[1;37myMMN\x1b[38;5;208mm\x1b[1;37md\x1b[38;5;208mhssssss/     \x1b[0m\x1b[0;36mRunning:\x1b[0m Docker, K8s, Nginx
\x1b[38;5;208m     /sssssssssss\x1b[1;37mhd\x1b[38;5;208mysso++os\x1b[1;37myMM\x1b[38;5;208mdysssss/      \x1b[0m\x1b[0;36mDeployed:\x1b[0m 47 containers
\x1b[38;5;208m      .ossssssssssssssssssd\x1b[1;37mMM\x1b[38;5;208mMysssso.       \x1b[0m\x1b[0;36mUptime:\x1b[0m 99.98%
\x1b[38;5;208m        -+ssssssssssssssssssyyssss+-         \x1b[0m
\x1b[38;5;208m          \`:+ssssssssssssssssss+:\`           \x1b[0m
\x1b[38;5;208m              \`.-/+oossssoo+/-.               \x1b[0m`,
  
  clear: 'CLEAR_TERMINAL',
};

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: '', output: 'Linux Portfolio Terminal v1.0.0\nType "help" for available commands.\n' }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/devops');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getDirectoryContents = (path: string): string | null => {
    const parts = path.split('/').filter(p => p);
    let current: any = FILE_SYSTEM;
    
    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    if (Array.isArray(current)) {
      return current.join('  ');
    } else if (typeof current === 'object') {
      return Object.keys(current).join('  ');
    }
    return null;
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const lowerCmd = trimmedCmd.toLowerCase();
    
    if (lowerCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Handle pwd command
    if (lowerCmd === 'pwd') {
      setHistory(prev => [...prev, { command: cmd, output: currentDir }]);
      return;
    }

    // Handle ls command
    if (lowerCmd === 'ls') {
      const contents = getDirectoryContents(currentDir);
      const output = contents || 'ls: cannot access: No such file or directory';
      setHistory(prev => [...prev, { command: cmd, output }]);
      return;
    }

    // Handle cd command
    if (lowerCmd.startsWith('cd')) {
      const args = trimmedCmd.split(' ');
      let newDir = currentDir;
      
      if (args.length === 1 || args[1] === '~') {
        // cd or cd ~ goes to home
        newDir = '/home/devops';
      } else if (args[1] === '..') {
        // cd .. goes up one directory
        const parts = currentDir.split('/').filter(p => p);
        if (parts.length > 1) {
          parts.pop();
          newDir = '/' + parts.join('/');
        } else {
          newDir = '/';
        }
      } else if (args[1] === '/') {
        // cd / goes to root
        newDir = '/';
      } else if (args[1].startsWith('/')) {
        // Absolute path
        const targetPath = args[1];
        const parts = targetPath.split('/').filter(p => p);
        let current: any = FILE_SYSTEM;
        let valid = true;
        
        for (const part of parts) {
          if (current[part]) {
            current = current[part];
          } else {
            valid = false;
            break;
          }
        }
        
        if (valid && typeof current === 'object' && !Array.isArray(current)) {
          newDir = targetPath;
        } else {
          setHistory(prev => [...prev, { 
            command: cmd, 
            output: `cd: ${args[1]}: No such file or directory` 
          }]);
          return;
        }
      } else {
        // Relative path
        const targetPath = currentDir === '/' ? `/${args[1]}` : `${currentDir}/${args[1]}`;
        const parts = targetPath.split('/').filter(p => p);
        let current: any = FILE_SYSTEM;
        let valid = true;
        
        for (const part of parts) {
          if (current[part]) {
            current = current[part];
          } else {
            valid = false;
            break;
          }
        }
        
        if (valid && typeof current === 'object' && !Array.isArray(current)) {
          newDir = targetPath;
        } else {
          setHistory(prev => [...prev, { 
            command: cmd, 
            output: `cd: ${args[1]}: No such file or directory` 
          }]);
          return;
        }
      }
      
      setCurrentDir(newDir);
      setHistory(prev => [...prev, { command: cmd, output: '' }]);
      return;
    }

    // Handle cd.. as an alias for cd ..
    if (lowerCmd === 'cd..') {
      const parts = currentDir.split('/').filter(p => p);
      let newDir = currentDir;
      if (parts.length > 1) {
        parts.pop();
        newDir = '/' + parts.join('/');
      } else {
        newDir = '/';
      }
      setCurrentDir(newDir);
      setHistory(prev => [...prev, { command: cmd, output: '' }]);
      return;
    }

    const output = COMMAND_RESPONSES[lowerCmd] || 
      `Command not found: ${cmd}\nType "help" for available commands.`;

    setHistory(prev => [...prev, { command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentCommand.trim()) {
        handleCommand(currentCommand);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-black/95 p-4 font-mono text-sm overflow-auto"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, index) => (
        <div key={index} className="mb-2">
          {entry.command && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary terminal-glow">ubuntu@MeghVyas:{currentDir}$</span>
              <span className="text-foreground">{entry.command}</span>
            </div>
          )}
          {entry.output && (
            <pre className="text-muted-foreground whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {entry.output}
            </pre>
          )}
        </div>
      ))}
      
      <div className="flex items-center gap-2">
        <span className="text-primary terminal-glow">ubuntu@MeghVyas:{currentDir}$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus:border-none text-foreground font-mono"
          autoFocus
        />
      </div>
    </div>
  );
};
