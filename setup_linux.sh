#!/usr/bin/env bash
# ============================================================
#  DACNTT Project - Setup Script for Linux
#  Ho tro: Ubuntu 20.04+, Debian 11+, CentOS 8+, RHEL 8+
#  Chay: sudo bash setup_linux.sh
# ============================================================

set -euo pipefail

# ── Config ───────────────────────────────────────────────────
MYSQL_ROOT_PASS="${1:-root1234}"
MYSQL_USER="app"
MYSQL_PASS="12345"
MYSQL_DB="bindata"
JAVA_VERSION="21"
NODE_VERSION="20"   # Node.js 20 LTS

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JAVA_WEB_DIR="$PROJECT_DIR/java-web"
DATABASE_SQL="$JAVA_WEB_DIR/database.sql"

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; GRAY='\033[0;37m'; BOLD='\033[1m'; NC='\033[0m'

log_step()  { echo -e "\n${CYAN}${BOLD}  [$1/$2] $3${NC}\n  $(printf '%.0s─' {1..52})"; }
log_ok()    { echo -e "  ${GREEN}[OK]${NC} $1"; }
log_skip()  { echo -e "  ${GRAY}[--]${NC} $1 (đã có sẵn)"; }
log_warn()  { echo -e "  ${YELLOW}[!!]${NC} $1"; }
log_err()   { echo -e "  ${RED}[ERROR]${NC} $1" >&2; }

is_installed() { command -v "$1" &>/dev/null; }

# ── Detect OS ────────────────────────────────────────────────
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_ID="${ID,,}"       # ubuntu, debian, centos, rhel, fedora, ...
        OS_VER="${VERSION_ID%%.*}"
    elif [ -f /etc/redhat-release ]; then
        OS_ID="centos"
        OS_VER="7"
    else
        log_err "Khong nhan dien duoc he dieu hanh."
        exit 1
    fi

    case "$OS_ID" in
        ubuntu|debian|linuxmint|pop)  PKG_MGR="apt"  ;;
        centos|rhel|rocky|almalinux)  PKG_MGR="dnf"  ;;
        fedora)                        PKG_MGR="dnf"  ;;
        *)
            log_warn "OS '$OS_ID' chua duoc test, dung apt lam mac dinh."
            PKG_MGR="apt"
            ;;
    esac
}

# ── Check root ───────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    log_err "Vui long chay script nay voi quyen root: sudo bash setup_linux.sh"
    exit 1
fi

detect_os

# ── Banner ───────────────────────────────────────────────────
clear
echo -e ""
echo -e "${CYAN}${BOLD}  ╔══════════════════════════════════════════════════╗"
echo -e "  ║     DACNTT Project - Linux Setup Script          ║"
echo -e "  ║   Java 21 + Maven + Node.js + MySQL 8.0          ║"
echo -e "  ╚══════════════════════════════════════════════════╝${NC}"
echo -e ""
echo -e "  OS            : $OS_ID $OS_VER ($PKG_MGR)"
echo -e "  Thu muc       : $PROJECT_DIR"
echo -e "  MySQL root    : root / $MYSQL_ROOT_PASS"
echo -e "  MySQL user    : $MYSQL_USER / $MYSQL_PASS"
echo -e "  Database      : $MYSQL_DB"
echo -e ""
echo -e "${YELLOW}  Nhan Enter de bat dau, Ctrl+C de huy...${NC}"
read -r

# ════════════════════════════════════════════════════════════
#  BUOC 1: Cap nhat he thong
# ════════════════════════════════════════════════════════════
log_step 1 5 "Cap nhat package list"

if [ "$PKG_MGR" = "apt" ]; then
    apt-get update -y -q
    apt-get install -y -q curl wget gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release
else
    dnf update -y -q 2>/dev/null || yum update -y -q
    dnf install -y -q curl wget gnupg2 ca-certificates 2>/dev/null || \
    yum install -y -q curl wget gnupg2 ca-certificates
fi
log_ok "He thong da cap nhat"

# ════════════════════════════════════════════════════════════
#  BUOC 2: Cai JDK 21
# ════════════════════════════════════════════════════════════
log_step 2 5 "Cai dat JDK $JAVA_VERSION (Eclipse Temurin / OpenJDK)"

java_ok=false
if is_installed java; then
    java_ver=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    if [[ "$java_ver" == 21* ]]; then
        log_skip "Java $java_ver"
        java_ok=true
    else
        log_warn "Java hien tai: $java_ver — se cai Java 21 song song"
    fi
fi

if [ "$java_ok" = false ]; then
    if [ "$PKG_MGR" = "apt" ]; then
        # Thu apt package truoc
        if apt-cache show openjdk-21-jdk &>/dev/null; then
            apt-get install -y -q openjdk-21-jdk
        else
            # Dung Adoptium repo
            wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public \
                | gpg --dearmor -o /usr/share/keyrings/adoptium.gpg
            echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] \
https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" \
                > /etc/apt/sources.list.d/adoptium.list
            apt-get update -q
            apt-get install -y -q temurin-21-jdk
        fi
    else
        # RPM-based
        dnf install -y java-21-openjdk-devel 2>/dev/null || \
        dnf install -y java-21-amazon-corretto-devel 2>/dev/null || {
            # Fallback: tai truc tiep Temurin
            TEMURIN_URL="https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jdk_x64_linux_hotspot_21.0.5_11.tar.gz"
            wget -q "$TEMURIN_URL" -O /tmp/jdk21.tar.gz
            mkdir -p /opt/jdk21
            tar -xzf /tmp/jdk21.tar.gz -C /opt/jdk21 --strip-components=1
            ln -sf /opt/jdk21/bin/java /usr/local/bin/java
            ln -sf /opt/jdk21/bin/javac /usr/local/bin/javac
            export JAVA_HOME="/opt/jdk21"
        }
    fi

    # Thiet lap JAVA_HOME
    if [ -z "${JAVA_HOME:-}" ]; then
        JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java) 2>/dev/null || which java)))
        export JAVA_HOME
    fi

    # Them vao /etc/profile.d/
    cat > /etc/profile.d/java.sh << EOF
export JAVA_HOME="$JAVA_HOME"
export PATH="\$JAVA_HOME/bin:\$PATH"
EOF
    chmod +x /etc/profile.d/java.sh

    log_ok "Java $(java -version 2>&1 | awk -F '"' '/version/ {print $2}')"
    log_ok "JAVA_HOME = $JAVA_HOME"
fi

# ════════════════════════════════════════════════════════════
#  BUOC 3: Cai Maven
# ════════════════════════════════════════════════════════════
log_step 3 5 "Cai dat Apache Maven"

if is_installed mvn; then
    log_skip "$(mvn -version 2>&1 | head -1)"
else
    if [ "$PKG_MGR" = "apt" ]; then
        apt-get install -y -q maven
    else
        dnf install -y maven 2>/dev/null || yum install -y maven
    fi

    if ! is_installed mvn; then
        # Cai tay neu pkg manager khong co
        MAVEN_VER="3.9.9"
        MAVEN_URL="https://archive.apache.org/dist/maven/maven-3/$MAVEN_VER/binaries/apache-maven-$MAVEN_VER-bin.tar.gz"
        log_warn "Package manager khong co Maven, tai truc tiep v$MAVEN_VER..."
        wget -q "$MAVEN_URL" -O /tmp/maven.tar.gz
        tar -xzf /tmp/maven.tar.gz -C /opt
        ln -sf /opt/apache-maven-$MAVEN_VER /opt/maven
        cat > /etc/profile.d/maven.sh << 'EOF'
export M2_HOME="/opt/maven"
export MAVEN_HOME="/opt/maven"
export PATH="$M2_HOME/bin:$PATH"
EOF
        chmod +x /etc/profile.d/maven.sh
        export PATH="/opt/maven/bin:$PATH"
    fi

    log_ok "$(mvn -version 2>&1 | head -1)"
fi

# ════════════════════════════════════════════════════════════
#  BUOC 4: Cai Node.js LTS
# ════════════════════════════════════════════════════════════
log_step 4 5 "Cai dat Node.js $NODE_VERSION LTS"

if is_installed node; then
    log_skip "Node.js $(node -v)  |  npm $(npm -v)"
else
    if [ "$PKG_MGR" = "apt" ]; then
        # NodeSource repo
        curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
        apt-get install -y -q nodejs
    else
        curl -fsSL "https://rpm.nodesource.com/setup_${NODE_VERSION}.x" | bash -
        dnf install -y nodejs 2>/dev/null || yum install -y nodejs
    fi

    log_ok "Node.js $(node -v)  |  npm $(npm -v)"
fi

# ════════════════════════════════════════════════════════════
#  BUOC 5: Cai MySQL 8.0 + tao database
# ════════════════════════════════════════════════════════════
log_step 5 5 "Cai dat MySQL 8.0 va tao co so du lieu"

if is_installed mysql; then
    log_skip "MySQL $(mysql --version | awk '{print $3}')"
else
    if [ "$PKG_MGR" = "apt" ]; then
        # Uu tien MySQL chinh thuc
        if ! apt-cache show mysql-server-8.0 &>/dev/null; then
            # Them repo MySQL chinh thuc
            wget -q https://dev.mysql.com/get/mysql-apt-config_0.8.29-1_all.deb -O /tmp/mysql-apt-config.deb
            DEBIAN_FRONTEND=noninteractive dpkg -i /tmp/mysql-apt-config.deb 2>/dev/null || true
            apt-get update -q
        fi
        DEBIAN_FRONTEND=noninteractive apt-get install -y -q mysql-server
    else
        # RPM-based — dung MySQL community repo
        if ! rpm -qa | grep -q mysql; then
            RPM_URL="https://dev.mysql.com/get/mysql84-community-release-el$(rpm -E %rhel)-1.noarch.rpm"
            dnf install -y "$RPM_URL" 2>/dev/null || yum install -y "$RPM_URL"
        fi
        dnf install -y mysql-community-server 2>/dev/null || yum install -y mysql-community-server
    fi
    log_ok "MySQL da cai xong"
fi

# Bat MySQL service
if systemctl is-active mysql &>/dev/null || systemctl is-active mysqld &>/dev/null; then
    log_ok "MySQL service dang chay"
else
    systemctl enable mysql 2>/dev/null || systemctl enable mysqld 2>/dev/null || true
    systemctl start mysql 2>/dev/null || systemctl start mysqld 2>/dev/null
    sleep 3
    log_ok "MySQL service da khoi dong"
fi

# ── Lay mat khau tam thoi (neu MySQL moi cai) ───────────────
MYSQL_CMD="mysql"
TEMP_PASS=""

# Kiem tra co mat khau tam thoi trong log khong
if [ -f /var/log/mysqld.log ]; then
    TEMP_PASS=$(grep "temporary password" /var/log/mysqld.log | awk '{print $NF}' | tail -1)
fi
if [ -z "$TEMP_PASS" ] && [ -f /var/log/mysql/error.log ]; then
    TEMP_PASS=$(grep "temporary password" /var/log/mysql/error.log | awk '{print $NF}' | tail -1)
fi

# Thu connect khong mat khau (Ubuntu/Debian dung auth_socket mac dinh)
if mysql -u root --connect-expired-password -e "SELECT 1;" &>/dev/null 2>&1; then
    ROOT_AUTH="mysql -u root"
elif [ -n "$TEMP_PASS" ] && mysql -u root -p"$TEMP_PASS" --connect-expired-password \
        -e "SELECT 1;" &>/dev/null 2>&1; then
    ROOT_AUTH="mysql -u root -p$TEMP_PASS --connect-expired-password"
    # Doi mat khau root ngay
    mysql -u root -p"$TEMP_PASS" --connect-expired-password \
        -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASS';" 2>/dev/null
    ROOT_AUTH="mysql -u root -p$MYSQL_ROOT_PASS"
    log_ok "Da doi mat khau root MySQL thanh '$MYSQL_ROOT_PASS'"
elif mysql -u root -p"$MYSQL_ROOT_PASS" -e "SELECT 1;" &>/dev/null 2>&1; then
    ROOT_AUTH="mysql -u root -p$MYSQL_ROOT_PASS"
else
    log_warn "Khong the tu dong xac thuc MySQL. Nhap mat khau root MySQL:"
    read -rsp "  MySQL root password: " ENTERED_PASS
    echo ""
    if mysql -u root -p"$ENTERED_PASS" -e "SELECT 1;" &>/dev/null 2>&1; then
        ROOT_AUTH="mysql -u root -p$ENTERED_PASS"
        MYSQL_ROOT_PASS="$ENTERED_PASS"
    else
        log_err "Sai mat khau MySQL root. Vui long setup database thu cong:"
        log_warn "  mysql -u root -p < $DATABASE_SQL"
        ROOT_AUTH=""
    fi
fi

# ── Tao user va import database ──────────────────────────────
if [ -n "$ROOT_AUTH" ]; then
    if [ ! -f "$DATABASE_SQL" ]; then
        log_err "Khong tim thay file: $DATABASE_SQL"
        exit 1
    fi

    $ROOT_AUTH --connect-expired-password << EOSQL 2>/dev/null
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASS}';
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASS}';
GRANT ALL PRIVILEGES ON ${MYSQL_DB}.* TO '${MYSQL_USER}'@'localhost';
GRANT ALL PRIVILEGES ON ${MYSQL_DB}.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL

    $ROOT_AUTH --connect-expired-password < "$DATABASE_SQL" 2>/dev/null
    log_ok "Database '$MYSQL_DB' da tao xong"
    log_ok "User '$MYSQL_USER'@'localhost' voi password '$MYSQL_PASS' da tao"
fi

# ════════════════════════════════════════════════════════════
#  Cai npm dependencies cho Frontend
# ════════════════════════════════════════════════════════════
echo -e "\n${CYAN}${BOLD}  [+] Cai npm dependencies cho Frontend${NC}"
echo -e "  $(printf '%.0s─' {1..52})"

cd "$PROJECT_DIR"
if npm install --prefer-offline 2>&1; then
    log_ok "npm install thanh cong"
else
    log_warn "npm install gap loi — kiem tra ket noi internet"
fi

# ════════════════════════════════════════════════════════════
#  Tao file .env cho Frontend
# ════════════════════════════════════════════════════════════
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << 'EOF'
# Frontend environment variables
VITE_API_BASE_URL=http://localhost:8081
EOF
    log_ok "Tao file .env"
fi

# ════════════════════════════════════════════════════════════
#  Dung quyen thuc thi cho script chay project
# ════════════════════════════════════════════════════════════
chmod +x "$JAVA_WEB_DIR/mvnw" 2>/dev/null || true

# Tao script start_backend.sh neu chua co
cat > "$PROJECT_DIR/start_backend.sh" << 'SCRIPT'
#!/usr/bin/env bash
cd "$(dirname "$0")/java-web"
./mvnw spring-boot:run
SCRIPT
chmod +x "$PROJECT_DIR/start_backend.sh"

# Tao script start_frontend.sh neu chua co
cat > "$PROJECT_DIR/start_frontend.sh" << 'SCRIPT'
#!/usr/bin/env bash
cd "$(dirname "$0")"
npm run dev
SCRIPT
chmod +x "$PROJECT_DIR/start_frontend.sh"

log_ok "Tao start_backend.sh va start_frontend.sh"

# ════════════════════════════════════════════════════════════
#  Tong ket
# ════════════════════════════════════════════════════════════
echo -e ""
echo -e "${GREEN}${BOLD}  ╔══════════════════════════════════════════════════╗"
echo -e "  ║         SETUP HOAN TAT THANH CONG!               ║"
echo -e "  ╚══════════════════════════════════════════════════╝${NC}"
echo -e ""
echo -e "  Phien ban da cai:"
is_installed java  && echo -e "    Java  : $(java -version 2>&1 | awk -F '"' '/version/ {print $2}')"
is_installed mvn   && echo -e "    Maven : $(mvn -version 2>&1 | head -1 | cut -d' ' -f1-3)"
is_installed node  && echo -e "    Node  : $(node -v)   npm: $(npm -v)"
is_installed mysql && echo -e "    MySQL : $(mysql --version | awk '{print $1,$3}')"
echo -e ""
echo -e "  Cach chay project:"
echo -e "${YELLOW}    Backend  : bash start_backend.sh${NC}"
echo -e "${GRAY}               hoac: cd java-web && ./mvnw spring-boot:run${NC}"
echo -e "${YELLOW}    Frontend : bash start_frontend.sh${NC}"
echo -e "${GRAY}               hoac: npm run dev${NC}"
echo -e ""
echo -e "  URLs:"
echo -e "${CYAN}    Frontend : http://localhost:5173${NC}"
echo -e "${CYAN}    Backend  : http://localhost:8081${NC}"
echo -e "${CYAN}    Swagger  : http://localhost:8081/swagger-ui/index.html${NC}"
echo -e ""
echo -e "  MySQL:"
echo -e "    Database : $MYSQL_DB"
echo -e "    User app : $MYSQL_USER / $MYSQL_PASS"
echo -e "    Root     : root / $MYSQL_ROOT_PASS"
echo -e ""
echo -e "${YELLOW}  LUU Y: Chay 'source /etc/profile.d/java.sh' hoac mo terminal moi${NC}"
echo -e "${YELLOW}         de PATH duoc cap nhat trong phien hien tai.${NC}"
echo -e ""
