# speckit-bridge

## Product Vision

> **JTBD**: requirements_designer の出力を spec-kit 形式に変換し、PM→Engineer ハンドオフを構造化する

| Field           | Definition                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Target User** | 要件定義完了後、エンジニアに引き渡したい PM / テックリード                                        |
| **Core Value**  | 意図のドリフト防止 — constitution.md で「なぜ」を、conventions.md で「どう守るか」を定義          |
| **Scope**       | designs/ → spec.md + constitution.md + conventions.md + enforcement scaffold (ESLint/Husky)       |
| **Non-Goals**   | 要件定義そのもの (requirements_designer の領域), 実装タスク分解 (spec-kit plan の領域), CI/CD構築 |

**Suite内の位置づけ**: `requirements_designer → **speckit-bridge** → my_pm_tools`。PM成果物をエンジニア仕様に変換するブリッジ。

---

requirements_designer の出力（`designs/`）を [GitHub spec-kit](https://github.com/github/spec-kit) の仕様書形式に変換するスキル。

## 何をするスキルか

PMが `/requirements_designer` で作った要件ドキュメント（7ファイル）を、エンジニアが `specify plan → tasks → implement` で実装できる形式（`spec.md` + `constitution.md` + `conventions.md`）に自動変換します。さらに ESLint/boundaries/Husky による多層ドリフト防止を設定します。

```
/requirements_designer → designs/ (PM成果物)
        ↓
/speckit-bridge → spec.md + constitution.md + conventions.md (Engineer入力)
        ↓
/speckit.plan → plan.md, data-model.md, contracts/
        ↓
/speckit.tasks → tasks.md
        ↓
/speckit.implement → コード
```

## 前提条件

- `/requirements_designer` で `designs/` が生成済みであること
- 品質スコアが 70 点以上（推奨）
- spec-kit CLI がインストール済みであること

```bash
# spec-kit CLI のインストール（初回のみ）
# PyPI の "specify" は別パッケージです。必ず以下のコマンドを使ってください。
uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git@v0.4.3"

# uv がない場合は先にインストール
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 使い方

### 基本

```
要件をspec-kitに変換して
```

または

```
/speckit-bridge
```

### トリガーワード

- `speckit-bridge` / `spec-kit変換` / `仕様変換`
- `要件をspec-kitに変換` / `spec.mdを生成`
- `エンジニアに渡せる形にして`
- `bridge to spec-kit` / `convert to spec`

## ワークフロー（10ステップ）

| Step | 名称                          | 概要                                                                                     |
| ---- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| 0    | Validation                    | `designs/` の存在・必須ファイル・品質スコアを検証                                        |
| 1    | Initialize spec-kit           | `.specify/` が未作成なら `specify init` を実行                                           |
| 1.5  | Project Structure Setup       | ディレクトリ構造チェック、`.gitignore` 更新、`CLAUDE.md` 規約追記を提案                  |
| 2    | Generate Constitution         | `designs/README.md` → `.specify/memory/constitution.md`（開発原則・制約）                |
| 2.5  | Generate Conventions          | `designs/` 全体 → `.specify/memory/conventions.md`（命名規約・構造規約・ビジネスルール） |
| 2.6  | Generate Enforcement Scaffold | ESLint naming-convention + eslint-plugin-boundaries + Husky pre-commit を設定提案        |
| 3    | Create Feature Branch & Spec  | プロジェクト名から feature branch を作成し、spec ディレクトリを準備                      |
| 4    | Generate spec.md              | 全 `designs/` ファイルを統合し、spec-kit テンプレート形式の `spec.md` を生成             |
| 5    | Quality Validation            | spec-kit チェックリストで品質検証（最大3イテレーション）                                 |
| 6    | Report Completion             | 変換サマリー・Anti-Drift 状況・次のステップを報告                                        |

---

### Step 0: Validation

- `designs/` ディレクトリの存在確認
- 必須: `README.md`, `functional_requirements.md`（FR-001 存在確認）, `user_stories.md`（US-001 存在確認）
- 任意: `non_functional_requirements.md`, `ubiquitous_language.md`, `ui_design_brief.md`（変換対象外、Figma 成果物として別管理）
- 品質スコアの確認（`functional_requirements.md` の Document Info セクションから読み取り）:
  - 未算出（`-/100`）→ `/requirements_designer` Phase 4A の実行を推奨し警告
  - 70 点未満 → 警告表示、ユーザー判断で続行可
  - 70 点以上 → そのまま変換

### Step 1: Initialize spec-kit

`.specify/` が存在しない場合:

```bash
specify init --here --ai claude --force
```

既に存在する場合はスキップ。

### Step 1.5: Project Structure Setup

Bridge 発動時にプロジェクトのディレクトリ構造を整理する。**全サブステップでユーザー確認を挟み、勝手にファイルを変更しない。**

#### 1.5a: ディレクトリ構造チェック

プロジェクトルートのディレクトリをスキャンし、存在状況を表形式で表示:

```
| Directory | Status | Owner | Git |
|-----------|--------|-------|-----|
| designs/  | [exists/missing] | PM | Yes |
| .specify/ | [exists/missing] | Auto | Yes |
| specs/    | [will be created] | PM->TL | Yes (feature branch) |
| src/      | [exists/missing] | Eng | Yes |
| tests/    | [exists/missing] | Eng | Yes |
| .claude/  | [exists/missing] | Auto | No (.gitignore) |
```

#### 1.5b: .gitignore の確認・更新

- `.gitignore` が存在しない場合: プロジェクト言語を検出し、適切な .gitignore を生成提案
- `.gitignore` が存在する場合: `.claude/` エントリがなければ追記提案（他は変更しない）
- Git で追跡すべきもの（.gitignore に入れない）: `designs/`, `.specify/`, `specs/`

#### 1.5c: CLAUDE.md ディレクトリ規約

- `CLAUDE.md` が存在する場合: `## Directory Structure` セクションがなければ追記提案
- `CLAUDE.md` が存在しない場合: スキップ（新規作成はユーザー判断に委ねる）

#### 1.5d: 構造に関するユーザー確認

全チェック結果を表示した上で「この構造で進めますか？」と確認してから Step 2 に進む。

---

### Step 2: Generate Constitution

`designs/README.md` を読み込み、`.specify/memory/constitution.md` を生成する。

#### Constitution マッピングルール

| designs/README.md セクション | constitution.md セクション             |
| ---------------------------- | -------------------------------------- |
| 2. 背景と目的 → 成功の定義   | Core Principles → I. Success Metrics   |
| 4. やりたいこと → 優先順位   | Core Principles → II. Scope Boundaries |
| 5. 制約・前提条件            | Additional Constraints                 |
| 6. 品質に関する期待値        | Quality Standards                      |

#### Constitution の構成

constitution.md はプロジェクトの**開発原則・アーキテクチャ制約**を定義するファイル。KPI やスコープ境界は spec.md に記載するため含めない。

主要セクション:

| セクション              | 内容                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| Core Principles         | Quality Gate (NON-NEGOTIABLE), Scope Discipline, プロジェクト固有原則          |
| Technical Constraints   | 技術的制約（予算・期限・スタック制限）+ NFR 主要目標値                         |
| Development Workflow    | requirements → specification → plan → tasks → implement のパイプライン         |
| Architecture Governance | Convention Authority, Decision Freeze, Business Rules Registry                 |
| Design Artifacts        | DESIGN.md / Figma の Source of Truth 階層（ui_design_brief.md 存在時のみ生成） |

#### Architecture Governance の詳細

- **Convention Authority**: `.specify/memory/conventions.md` が命名決定の権威。ESLint + boundaries が構造を強制
- **Decision Freeze**: spec 時点で凍結される設計判断（レスポンスエンベロープ、エラー形式、DB命名、ディレクトリ構造）。変更には `/speckit-bridge` 再実行が必要
- **Business Rules Registry**: スキーマ/リンターで表現不可能なルールを conventions.md Section 4 に記録。PR レビュー時に必ず確認

---

### Step 2.5: Generate Conventions (Anti-Drift)

`designs/` 全体を読み込み、`.specify/memory/conventions.md` を生成する。50行以下の薄いリファレンス。

#### Why conventions.md が必要か

Claude Code はセッション間で設計判断を保持できず、以下がドリフトする:

- ディレクトリ構造（ファイル配置がバラバラ）
- API設計（エンドポイント命名、レスポンス形式）
- DBスキーマ（テーブル命名、カラム規約）

conventions.md は「意図の宣言」として機能する（遵守率 ~60%）。ランタイム強制は Step 2.6 の ESLint ルールが担う（遵守率 ~100%）。

#### ソース優先順位

1. `designs/ubiquitous_language.md` Section 2 (Glossary) + Section 4 (Naming Rules)
2. `designs/functional_requirements.md`（ビジネスルール、CRUD 動詞からエンティティ抽出）
3. `designs/README.md` Section 5（技術制約・スタック情報）
4. `designs/non_functional_requirements.md`（DB/API 制約）

#### conventions.md の5セクション構成

| Section                | 内容                                                 | ソース                        |
| ---------------------- | ---------------------------------------------------- | ----------------------------- |
| 1. Directory Structure | ファイル配置パターン（singular PascalCase 等）       | UL Section 4, tech stack 検出 |
| 2. Database            | テーブル命名（snake_case plural）、PK/FK 規約        | UL, NFR                       |
| 3. API                 | ベースパス、エンベロープ形式、エラー形式             | NFR, README Section 5         |
| 4. Business Rules      | スキーマ/リンターで表現不可能なルール（FR から抽出） | FR のビジネスルール           |
| 5. Design Tokens       | DESIGN.md 存在時のトークン命名パターン               | DESIGN.md                     |

#### UL が存在しない場合のフォールバック

`designs/ubiquitous_language.md` が存在しない場合:

1. `designs/functional_requirements.md` の Actor, Postcondition から主要な名詞を抽出
2. `package.json`, `go.mod`, `pyproject.toml` 等から tech stack を検出し、ディレクトリパターンを推定
3. 警告を出力: 「UL 定義が不足しています。ドリフトリスクが高い状態です。`/requirements_designer` Phase 4C でユビキタス言語を定義することを強く推奨します。」

#### Existing Codebase Compatibility（Enhance モード）

`src/` ディレクトリに既存コードがある場合:

1. 既存のファイル命名パターンをスキャン（PascalCase? camelCase?）
2. 既存のディレクトリ構造を検出
3. conventions.md は既存パターンに合わせて生成する（新パターンを押し付けない）
4. 不一致がある場合はユーザーに確認

---

### Step 2.6: Generate Enforcement Scaffold

conventions.md と同時に、**コードレベルで規約を強制する設定ファイル**を生成提案する。ドキュメント（conventions.md）だけではAIの遵守率は50-70%。ESLint等のランタイム強制で95%+に引き上げる。

ESLint のエラーメッセージは「AI教師信号」として機能する — AIがエラーを受け取ると2-3回の反復で規約パターンを学習する。

**全サブステップでユーザー確認を挟む。既存設定がある場合は差分のみ提案。**

#### 段階的導入ガイド

| Phase   | タイミング                | 追加ツール                                                  |
| ------- | ------------------------- | ----------------------------------------------------------- |
| A (MVP) | プロジェクト初日          | ESLint naming-convention + eslint-plugin-boundaries + Husky |
| B       | 3つ目のエンティティ追加時 | plop.js（ファイル生成テンプレート）                         |
| C       | API外部公開時             | Spectral（OpenAPIリンター）、prisma-lint                    |

**Phase A のみ** をこのステップで設定。Phase B/C は Step 6 の Next Steps で案内。

#### 2.6a: ESLint naming-convention（TypeScript の場合）

`designs/ubiquitous_language.md` Section 4 の Target Stack から言語を検出。TypeScript プロジェクト（`package.json` + `tsconfig.json` 存在）の場合、`@typescript-eslint/naming-convention` ルールを追加提案。

#### 2.6b: eslint-plugin-boundaries

conventions.md Section 1 のディレクトリ構造ルールから import 境界ルールを生成。`routes → services → repositories → models` の依存方向を強制。

#### 2.6c: Husky pre-commit hook

`.husky/pre-commit` に `npx lint-staged`、`package.json` の lint-staged に `*.{ts,tsx}` → `eslint --fix` を追加提案。Husky が未導入の場合は `npx husky init` の実行を提案。

#### Non-TypeScript プロジェクトの場合

| 言語   | ツール          | 提案内容                                       |
| ------ | --------------- | ---------------------------------------------- |
| Python | `ruff`          | naming convention ルール                       |
| Go     | `golangci-lint` | `revive` ルール                                |
| その他 | なし            | conventions.md のみ生成し、Step 2.6 はスキップ |

---

### Step 3: Create Feature Branch and Spec

1. `designs/README.md` セクション1 の「名称」フィールドからプロジェクト名を取得
2. short-name を生成（2-4 words, kebab-case。例: "Smart Order Manager" → "smart-order-manager"）
3. spec-kit のブランチ作成スクリプトを実行:

```bash
.specify/scripts/bash/create-new-feature.sh --json --short-name "[short-name]" "[一行説明]"
```

4. 出力された JSON から BRANCH_NAME と SPEC_FILE のパスを記録
5. スクリプトが存在しない場合のフォールバック: `mkdir -p specs/001-[short-name]` で手動作成

### Step 4: Generate spec.md

全 `designs/` ファイルを読み込み、spec-kit の `spec-template.md` 形式で `spec.md` を生成する。

#### Section Mapping

| designs/ ソース                             | spec.md セクション                | 変換ルール                                                                                   |
| ------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `user_stories.md`                           | User Scenarios & Testing          | US-001 → User Story 1 (P1/P2/P3)。受け入れ基準 → Given-When-Then 形式の Acceptance Scenarios |
| `functional_requirements.md` (例外フロー)   | Edge Cases                        | 全 FR の例外フローを収集・集約                                                               |
| `functional_requirements.md`                | Functional Requirements           | FR-001 → "System MUST [capability]" 形式。Must のみ含める                                    |
| `functional_requirements.md` (Should/Could) | Assumptions                       | 「将来検討」として自然言語で記載（FR ID を直接記載せず混同を防止）                           |
| `ubiquitous_language.md`                    | Key Entities                      | UL 用語 → エンティティ（存在しない場合は FR から名詞を抽出）                                 |
| `README.md` セクション2                     | Success Criteria                  | 成功の定義 → SC-001 形式（技術非依存・測定可能）                                             |
| `README.md` セクション5 + NFR               | Assumptions                       | 制約条件 + Should/Could FR + NFR 目標値                                                      |
| `ui_design_brief.md`                        | User Scenarios (Screen Reference) | SCR-XXX ↔ US-XXX マッピング（存在する場合のみ）                                              |

#### NEEDS CLARIFICATION ルール

事前条件やビジネスルールに曖昧さがある場合、`[NEEDS CLARIFICATION]` マーカーを付与。**最大3個**（spec-kit テンプレートの推奨に準拠）。3個を超える場合は影響度の高い順に3個を選び、残りは合理的なデフォルトで解決する。

---

### Step 5: Quality Validation

spec.md 生成後、spec-kit の品質チェックリストを実行:

1. `.specify/templates/checklist-template.md` を参照し、`specs/[feature]/checklists/requirements.md` を生成
2. 以下を検証:
   - [ ] 実装詳細（言語、FW、API）が含まれていないこと
   - [ ] 全必須セクションが完了していること
   - [ ] FR が全てテスト可能で曖昧でないこと
   - [ ] 成功基準が測定可能で技術非依存であること
   - [ ] `[NEEDS CLARIFICATION]` が 3 個以下であること
   - [ ] FR のビジネスルールで、スキーマ/リンターで表現不可能なものが conventions.md Section 4 に記載されていること（例: soft delete ポリシー、監査証跡パターン、マルチテナンシーアクセス制御、条件付きバリデーション）
3. 不合格項目があれば spec.md / conventions.md を修正（最大3イテレーション）

---

### Step 6: Report Completion

完了時に以下のレポートを出力:

```
speckit-bridge 完了

生成ファイル:
  .specify/memory/constitution.md  -- プロジェクト原則 + Architecture Governance
  .specify/memory/conventions.md   -- 命名規約・構造規約（50行以下）
  specs/[feature]/spec.md          -- 統合仕様書
  specs/[feature]/checklists/      -- 品質チェックリスト

Anti-Drift 状況:
  conventions.md:           生成済み（L1: Intent）
  ESLint naming-convention: [設定済み / ESLint未導入]（L2: Guard）
  eslint-plugin-boundaries: [設定済み / 未導入]（L2: Guard）
  Husky pre-commit:         [設定済み / 未導入]（L3: Gate）
  Business Rules:           [X]件 抽出（スキーマ外ルール）

変換サマリー:
  FR: [X]件 → Functional Requirements
  US: [X]件 → User Scenarios
  NFR: [X]件 → Assumptions / Constraints
  UL: [X]件 → Key Entities
  SC: [X]件 → Success Criteria
  BR: [X]件 → Business Rules（conventions.md Section 4）

次のステップ:
  /speckit.plan   → 技術設計（plan.md, data-model.md, contracts/）
  /speckit.tasks  → タスク分解（tasks.md）
  /speckit.clarify → [NEEDS CLARIFICATION] の解決（該当がある場合）

成長時の追加ツール（Phase B/C）:
  3つ目のエンティティ追加時 → plop.js（ファイル生成テンプレート）
  API外部公開時 → Spectral（OpenAPIリンター）+ prisma-lint
```

---

## 多層ドリフト防止（Anti-Drift 4-Layer Defense）

Claude Code はセッション間で設計判断を保持できず、命名規約・ディレクトリ構造・API設計がドリフトします。speckit-bridge は4層の防御でこれを防ぎます。

| Layer                | 仕組み                                                                 | 遵守率 | 生成 Step |
| -------------------- | ---------------------------------------------------------------------- | ------ | --------- |
| L1: Intent           | `conventions.md` — 命名規約・構造規約・ビジネスルールを宣言            | ~60%   | Step 2.5  |
| L2: Guard (naming)   | ESLint `@typescript-eslint/naming-convention` — 命名をランタイムで強制 | ~95%   | Step 2.6a |
| L2: Guard (boundary) | `eslint-plugin-boundaries` — import 依存関係をランタイムで強制         | ~95%   | Step 2.6b |
| L3: Gate             | Husky pre-commit + lint-staged — コミット時にLintエラーをブロック      | ~100%  | Step 2.6c |

### conventions.md（Step 2.5 詳細）

`designs/` 全体から生成される**50行以下**の薄いリファレンス。5セクション構成:

1. **Directory Structure** -- ファイル配置パターン（singular PascalCase 等）
2. **Database** -- テーブル命名（snake_case plural）、PK/FK 規約
3. **API** -- ベースパス、エンベロープ形式、エラー形式
4. **Business Rules** -- スキーマ/リンターで表現不可能なルール（FR から抽出）
5. **Design Tokens** -- DESIGN.md 存在時のトークン命名パターン

ソース優先順位: `ubiquitous_language.md` > `functional_requirements.md` > `README.md` > `non_functional_requirements.md`

既存コードがある場合は既存パターンに合わせて生成（Enhance モード）。

### Enforcement Scaffold（Step 2.6 詳細）

段階的に導入。このステップでは Phase A のみ設定:

| Phase   | タイミング                | ツール                              |
| ------- | ------------------------- | ----------------------------------- |
| A (MVP) | プロジェクト初日          | ESLint naming + boundaries + Husky  |
| B       | 3つ目のエンティティ追加時 | plop.js（ファイル生成テンプレート） |
| C       | API外部公開時             | Spectral + prisma-lint              |

Non-TypeScript 対応: Python → `ruff`, Go → `golangci-lint`。対応外言語は conventions.md のみ。

## 変換マッピング（Mapping Reference）

| #   | designs/ ファイル                | spec-kit 出力先                       | 変換内容                      |
| --- | -------------------------------- | ------------------------------------- | ----------------------------- |
| 1   | `README.md`                      | `constitution.md`                     | 目的・原則・制約・成功指標    |
| 2   | `README.md`                      | `spec.md` Success Criteria            | 成功の定義 → SC-001 形式      |
| 3   | `README.md`                      | `spec.md` Assumptions                 | 制約・前提条件                |
| 4   | `functional_requirements.md`     | `spec.md` Functional Requirements     | FR-001 → "System MUST" 形式   |
| 5   | `functional_requirements.md`     | `spec.md` Edge Cases                  | 各 FR の例外フロー            |
| 6   | `functional_requirements.md`     | `conventions.md` Section 4            | スキーマ外ビジネスルール      |
| 7   | `non_functional_requirements.md` | `spec.md` Assumptions                 | NFR 目標値を制約として        |
| 8   | `non_functional_requirements.md` | `constitution.md` Quality Standards   | 主要 NFR を品質基準に         |
| 9   | `user_stories.md`                | `spec.md` User Scenarios & Testing    | US → User Story (P1/P2/P3)    |
| 10  | `ubiquitous_language.md`         | `spec.md` Key Entities                | UL 用語 → エンティティ        |
| 11  | `ubiquitous_language.md`         | `conventions.md` Sections 1-5         | 命名規約・構造規約            |
| 12  | `ui_design_brief.md`             | `spec.md` User Scenarios (Screen Ref) | SCR-XXX <-> US-XXX マッピング |
| 13  | `ui_design_brief.md`             | `constitution.md` Design Artifacts    | Figma URL 参照                |
| 14  | DESIGN.md (root)                 | `conventions.md` Section 5            | トークン命名規約の継承        |
| 15  | DESIGN.md (root)                 | `constitution.md` Design Artifacts    | HEAL/SYNC プロトコル参照      |

## 生成されるファイル

```
.specify/
  memory/
    constitution.md          -- プロジェクトの開発原則・Architecture Governance
    conventions.md           -- 命名規約・構造規約・ビジネスルール（50行以下）
specs/
  [feature-name]/
    spec.md                  -- 統合仕様書
    checklists/
      requirements.md        -- 品質チェックリスト
```

加えて、以下の設定ファイルの追加・更新を提案（ユーザー確認後に実行）:

| ファイル                         | 内容                                  |
| -------------------------------- | ------------------------------------- |
| `.eslintrc` / `eslint.config.js` | naming-convention + boundaries ルール |
| `.husky/pre-commit`              | `npx lint-staged`                     |
| `package.json` (lint-staged)     | `*.{ts,tsx}` → `eslint --fix`         |

## プロジェクト構造の自動整理

Bridge 発動時に、プロジェクトのディレクトリ構造を自動チェックし整理を提案します:

- ディレクトリの存在状況を表形式で表示
- `.gitignore` の確認・不足エントリの追記提案（`.claude/` 等）
- プロジェクト `CLAUDE.md` にディレクトリ規約の追記提案

```
my-project/
├── designs/         -- PM成果物（Git追跡: Yes）
├── .specify/        -- spec-kit 設定（Git追跡: Yes）
├── specs/           -- 仕様書・計画書（Git追跡: Yes, feature branch）
├── src/             -- 実装コード（Git追跡: Yes）
├── tests/           -- テスト（Git追跡: Yes）
├── .claude/         -- Claude Code 設定（Git追跡: No）
├── .gitignore
├── CLAUDE.md
└── package.json
```

全ての変更はユーザー確認後に実行されます（勝手にファイルを変更しません）。

## 品質ゲート

- 品質スコア 70 点以上: そのまま変換
- 品質スコア 70 点未満: 警告を表示、ユーザー判断で続行可
- 品質スコア未算出（`-/100`）: `/requirements_designer` の Phase 4A 実行を推奨
- spec.md 生成後に品質チェックリストを実行（最大3イテレーションで修正）
- `[NEEDS CLARIFICATION]` マーカーは最大3個。超過時は影響度順に3個を選択し、残りは合理的なデフォルトで解決

## 変換の使用例

`examples/` ディレクトリに before/after サンプルを収録:

| ディレクトリ       | 内容                                                                          |
| ------------------ | ----------------------------------------------------------------------------- |
| `examples/before/` | `designs/` の入力例（README.md, functional_requirements.md, user_stories.md） |
| `examples/after/`  | 変換後の出力例（constitution.md, conventions.md, spec.md）                    |

## 変換後の次のステップ

| コマンド             | 誰が実行  | 生成物                             |
| -------------------- | --------- | ---------------------------------- |
| `/speckit.plan`      | Tech Lead | plan.md, data-model.md, contracts/ |
| `/speckit.tasks`     | Tech Lead | tasks.md（依存関係付き）           |
| `/speckit.clarify`   | PM        | [NEEDS CLARIFICATION] の解決       |
| `/speckit.implement` | Engineer  | コード                             |

成長時の追加ツール（Step 6 で案内）:

| タイミング                | ツール                                   |
| ------------------------- | ---------------------------------------- |
| 3つ目のエンティティ追加時 | plop.js（ファイル生成テンプレート）      |
| API外部公開時             | Spectral（OpenAPIリンター）+ prisma-lint |

## エラーハンドリング（9シナリオ）

| #   | エラー                       | 対処                                                                                            |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | `designs/` が存在しない      | `/requirements_designer` の実行を促す                                                           |
| 2   | `FR-001` が存在しない        | Phase 2（機能要件の抽出）の完了を促す                                                           |
| 3   | `US-001` が存在しない        | Phase 4B（ユーザーストーリー生成）の完了を促す                                                  |
| 4   | 品質スコア < 70              | 警告表示、ユーザー判断でオーバーライド可                                                        |
| 5   | 品質スコア未算出（`-/100`）  | Phase 4A の実行を推奨、ユーザー判断で続行可                                                     |
| 6   | `specify` CLI が見つからない | `uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git@v0.4.3"` を案内 |
| 7   | `.specify/` が存在しない     | `specify init --here --ai claude --force` を実行                                                |
| 8   | UL 未定義                    | FR からエンティティを推定し、UL 定義を推奨する警告を表示                                        |
| 9   | 既存コードとの規約不一致     | Enhance モードで既存パターンに合わせ、差異をユーザーに確認                                      |

## 言語サポート

| 対象                       | 言語                                                                       |
| -------------------------- | -------------------------------------------------------------------------- |
| SKILL.md                   | 英語（Claude Code 規約）                                                   |
| ユーザー出力（レポート等） | 日本語（CLAUDE.md Communication ルール準拠）                               |
| spec.md セクションヘッダ   | 英語（spec-kit テンプレート準拠）                                          |
| FR/US/NFR ID               | 英語（`FR-001`, `US-001` 等）                                              |
| エンティティ名             | 英語（後続の `specify plan` が英語前提）                                   |
| 説明文・ストーリー本文     | 英語推奨（日本語も許容。ただし `specify plan` 出力品質低下の可能性を警告） |

## Roadmap

| 機能                     | ステータス | 説明                                                           |
| ------------------------ | ---------- | -------------------------------------------------------------- |
| conventions.md 生成      | 実装済み   | Step 2.5: 命名規約・構造規約・ビジネスルールの自動生成         |
| ESLint / boundaries 連携 | 実装済み   | Step 2.6: naming-convention + eslint-plugin-boundaries + Husky |
| Issue巻き戻し            | 未実装     | 実装スコープへのフィードバックによる要件差し戻し機能           |

## 関連スキル

- `/requirements_designer` -- 要件定義（このスキルの入力を生成）
- `/writing-plans` -- 実装計画（spec-kit を使わない場合の代替）
- `/brainstorming` -- アイデアが固まらない段階で使用
