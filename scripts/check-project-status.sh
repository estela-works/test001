#!/bin/bash
# プロジェクトステータスチェックスクリプト
# Usage: ./scripts/check-project-status.sh [project_folder]

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ステータスアイコン
DONE="[✓]"
PENDING="[ ]"
PARTIAL="[~]"

# ベースディレクトリ
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECTS_DIR="$PROJECT_ROOT/docs/projects"
SPECS_DIR="$PROJECT_ROOT/docs/specs"
SRC_DIR="$PROJECT_ROOT/src"

# フェーズごとの必要ファイル定義
REQUIREMENTS_FILES=("requirements.md")
BASIC_DESIGN_FILES=("basic-design-frontend.md" "basic-design-backend.md")
DETAIL_DESIGN_FILES=("detail-design-frontend.md" "detail-design-api.md" "detail-design-logic.md" "detail-design-db.md" "detail-design-sql.md")
TEST_SPEC_FILES=("test-spec.md")

# ファイル存在チェック (内容があるかも確認)
check_file_exists() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local size=$(wc -c < "$file" 2>/dev/null || echo "0")
        if [[ $size -gt 100 ]]; then
            return 0  # ファイルあり、内容あり
        else
            return 2  # ファイルあり、内容なし/少ない
        fi
    fi
    return 1  # ファイルなし
}

# フェーズのステータスチェック
check_phase_status() {
    local project_dir="$1"
    shift
    local files=("$@")
    local found=0
    local total=${#files[@]}

    for file in "${files[@]}"; do
        if check_file_exists "$project_dir/$file"; then
            ((found++))
        fi
    done

    if [[ $found -eq $total ]]; then
        echo "done"
    elif [[ $found -gt 0 ]]; then
        echo "partial"
    else
        echo "pending"
    fi
}

# 実装ステータスチェック (プロジェクト名からソースファイルを推測)
check_implementation_status() {
    local project_name="$1"

    # プロジェクトの要件定義書から関連ファイルを特定する（簡易版）
    # 実際のプロジェクトでは要件定義書の内容を解析して判断

    # Javaソースファイルの存在確認
    local java_count=$(find "$SRC_DIR/main/java" -name "*.java" 2>/dev/null | wc -l)

    if [[ $java_count -gt 0 ]]; then
        echo "done"
    else
        echo "pending"
    fi
}

# テストコード実装ステータスチェック
check_test_implementation_status() {
    local test_count=$(find "$SRC_DIR/test" -name "*Test.java" 2>/dev/null | wc -l)

    if [[ $test_count -gt 0 ]]; then
        echo "done"
    else
        echo "pending"
    fi
}

# テスト実行ステータスチェック (直近のテスト結果を確認)
check_test_execution_status() {
    # surefire-reportsの存在確認
    local reports_dir="$PROJECT_ROOT/target/surefire-reports"
    if [[ -d "$reports_dir" ]]; then
        local report_count=$(find "$reports_dir" -name "*.xml" 2>/dev/null | wc -l)
        if [[ $report_count -gt 0 ]]; then
            echo "done"
        else
            echo "pending"
        fi
    else
        echo "pending"
    fi
}

# スペック適用ステータスチェック
check_spec_applied_status() {
    local project_dir="$1"

    # specsフォルダ内のファイル更新日時とプロジェクトファイルの更新日時を比較
    local specs_files=("$SPECS_DIR/api-catalog.md" "$SPECS_DIR/db-schema.md" "$SPECS_DIR/logic-catalog.md" "$SPECS_DIR/screen-catalog.md")
    local applied=0

    for spec_file in "${specs_files[@]}"; do
        if [[ -f "$spec_file" ]]; then
            ((applied++))
        fi
    done

    if [[ $applied -eq ${#specs_files[@]} ]]; then
        echo "done"
    elif [[ $applied -gt 0 ]]; then
        echo "partial"
    else
        echo "pending"
    fi
}

# ステータス表示
print_status() {
    local status="$1"
    local phase_name="$2"
    local description="$3"

    case $status in
        "done")
            echo -e "${GREEN}${DONE}${NC} $phase_name: $description"
            ;;
        "partial")
            echo -e "${YELLOW}${PARTIAL}${NC} $phase_name: $description"
            ;;
        "pending")
            echo -e "${RED}${PENDING}${NC} $phase_name: $description"
            ;;
    esac
}

# プロジェクトのステータスチェック
check_project() {
    local project_dir="$1"
    local project_name=$(basename "$project_dir")

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}プロジェクト: $project_name${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    # 1. 要件定義フェーズ
    local req_status=$(check_phase_status "$project_dir" "${REQUIREMENTS_FILES[@]}")
    print_status "$req_status" "要件定義" "要件定義書を作成"

    # 2. 基本設計フェーズ
    local basic_status=$(check_phase_status "$project_dir" "${BASIC_DESIGN_FILES[@]}")
    print_status "$basic_status" "基本設計" "フロント・バック基本設計を作成"

    # 3. 詳細設計フェーズ
    local detail_status=$(check_phase_status "$project_dir" "${DETAIL_DESIGN_FILES[@]}")
    print_status "$detail_status" "詳細設計" "各詳細設計ドキュメントを作成"

    # 4. テスト仕様フェーズ
    local test_spec_status=$(check_phase_status "$project_dir" "${TEST_SPEC_FILES[@]}")
    print_status "$test_spec_status" "テスト仕様" "テスト仕様書を作成"

    # 5. 実装フェーズ
    local impl_status=$(check_implementation_status "$project_name")
    print_status "$impl_status" "実装" "ソースコードを実装"

    # 6. テスト構築フェーズ
    local test_impl_status=$(check_test_implementation_status)
    print_status "$test_impl_status" "テスト構築" "テストコードを実装"

    # 7. テスト実行フェーズ
    local test_exec_status=$(check_test_execution_status)
    print_status "$test_exec_status" "テスト実行" "テストを実施"

    # 8. 事後フェーズ
    local spec_status=$(check_spec_applied_status "$project_dir")
    print_status "$spec_status" "事後処理" "スペックを適用"

    echo ""

    # サマリー計算
    local done_count=0
    local partial_count=0
    local pending_count=0

    for status in "$req_status" "$basic_status" "$detail_status" "$test_spec_status" "$impl_status" "$test_impl_status" "$test_exec_status" "$spec_status"; do
        case $status in
            "done") ((done_count++)) ;;
            "partial") ((partial_count++)) ;;
            "pending") ((pending_count++)) ;;
        esac
    done

    local total=8
    local progress=$((done_count * 100 / total))

    echo -e "進捗: ${GREEN}完了 $done_count${NC} / ${YELLOW}一部 $partial_count${NC} / ${RED}未着手 $pending_count${NC} (${progress}%)"
}

# メイン処理
main() {
    echo ""
    echo "======================================"
    echo "  プロジェクトステータスチェッカー"
    echo "======================================"

    if [[ -n "$1" ]]; then
        # 特定プロジェクトのみチェック
        if [[ -d "$PROJECTS_DIR/$1" ]]; then
            check_project "$PROJECTS_DIR/$1"
        else
            echo -e "${RED}エラー: プロジェクト '$1' が見つかりません${NC}"
            exit 1
        fi
    else
        # 全プロジェクトをチェック (templateを除外)
        for project_dir in "$PROJECTS_DIR"/*; do
            if [[ -d "$project_dir" && "$(basename "$project_dir")" != "template" ]]; then
                check_project "$project_dir"
            fi
        done
    fi

    echo ""
    echo "======================================"
    echo "  チェック完了"
    echo "======================================"
}

main "$@"
