---
name: speckit-bridge
description: >-
  Convert requirements_designer output (designs/) into spec-kit format (spec.md + constitution.md).
  Bridges PM requirements workflow to engineer implementation pipeline.
  Use after /requirements_designer completes with quality score >= 70.
type: automation
best_for:
  - "Connecting requirements_designer output to spec-kit pipeline"
  - "Converting FR/NFR/US documents into a unified spec.md"
  - "Generating project constitution from project charter"
  - "Enabling PM → Engineer handoff via structured specifications"
triggers:
  - "speckit-bridge"
  - "spec-kit変換"
  - "仕様変換"
  - "要件をspec-kitに変換"
  - "spec.mdを生成"
  - "エンジニアに渡せる形にして"
  - "bridge to spec-kit"
  - "convert to spec"
---

# Speckit Bridge

requirements_designer の出力（`designs/`）を spec-kit の仕様書形式（`spec.md` + `constitution.md`）に変換するスキル。

---

## Prerequisites

1. `designs/` ディレクトリが存在し、少なくとも以下が含まれること:
   - `designs/README.md`（プロジェクト憲章）
   - `designs/functional_requirements.md`（FR-001 以上の要件）
   - `designs/user_stories.md`（US-001 以上のストーリー）
2. spec-kit CLI がインストール済み: `specify --help` で確認
3. 品質スコアが 70 点以上であること（未達の場合は警告し `/requirements_designer` への差し戻しを提案）

---

## Workflow

### Step 0: Validation

1. `designs/` ディレクトリの存在を確認
2. 必須ファイルの存在チェック:
   - `designs/README.md` → 必須
   - `designs/functional_requirements.md` → 必須（FR-001 の存在も確認）
   - `designs/user_stories.md` → 必須（US-001 の存在も確認）
   - `designs/non_functional_requirements.md` → 任意
   - `designs/ubiquitous_language.md` → 任意
   - `designs/ui_design_brief.md` → 任意（変換対象外、Figma 成果物として別管理）
3. 品質スコアの確認:
   - `designs/functional_requirements.md` の Document Info セクションから「品質スコア」または「Quality Score」フィールドを読み取る
   - 形式は `XX/100` または `-/100`（未算出）
   - **未算出（`-/100`）の場合**: 「品質スコアが未算出です。/requirements_designer の Phase 4A で品質評価を実行してください。このまま変換を続けますか？」と警告
   - **70 点未満の場合**: 「品質スコアが [XX]/100 です（推奨: 70点以上）。/requirements_designer で品質を改善してから変換することを推奨します。このまま変換を続けますか？」と警告
   - ユーザーが続行を選択した場合のみ進む

### Step 1: Initialize spec-kit Project

プロジェクトルートに `.specify/` が存在しない場合:

```bash
specify init --here --ai claude --force
```

既に存在する場合はスキップ。

### Step 2: Generate Constitution

`designs/README.md` を読み込み、`.specify/memory/constitution.md` を生成する。

#### Mapping Rules

| designs/README.md セクション | constitution.md セクション |
|---|---|
| 2. 背景と目的 → 成功の定義 | Core Principles → I. Success Metrics |
| 4. やりたいこと → 優先順位 | Core Principles → II. Scope Boundaries |
| 5. 制約・前提条件 | Additional Constraints |
| 6. 品質に関する期待値 | Quality Standards |

#### Generation Template

constitution.md はプロジェクトの **開発原則・アーキテクチャ制約** を定義するファイル。
KPI やスコープ境界は spec.md の Success Criteria / Assumptions に記載するため、ここには含めない。

```markdown
# [プロジェクト名] Constitution

## Core Principles

### I. Quality Gate (NON-NEGOTIABLE)
Requirements quality score must be >= 70 before implementation.
All functional requirements must have testable acceptance criteria.
TDD mandatory: tests written before implementation.

### II. Scope Discipline
[designs/README.md セクション4「やりたいこと」の Out of Scope から抽出し、
 「以下は本プロジェクトでは実装しない」形式の原則に変換]

### III. [プロジェクト固有の開発原則]
[designs/README.md セクション5「制約・前提条件」から技術制約を抽出し、
 開発原則として記述。例: "Mobile-First", "Offline-Ready", "API-First" 等]

## Technical Constraints
[designs/README.md セクション5 の技術的制約（予算、期限、技術スタック制限等）]
[designs/non_functional_requirements.md の主要 NFR 目標値（存在する場合）]

## Development Workflow
- Requirements: /requirements_designer → designs/
- Specification: /speckit-bridge → spec.md
- Pipeline: specify plan → specify tasks → specify implement
- All changes must trace back to a FR or US

## Governance
- Constitution is generated from requirements_designer output
- Updates require re-running /requirements_designer and /speckit-bridge
- Constitution supersedes ad-hoc decisions during implementation

**Version**: 1.0 | **Generated**: [DATE] | **Source**: designs/README.md
```

### Step 3: Create Feature Branch and Spec

1. プロジェクト名を `designs/README.md` セクション1 の「名称」フィールドから取得
2. short-name を名称から生成（2-4 words, kebab-case。例: "Smart Order Manager" → "smart-order-manager"）
3. 一行説明を feature description として使用
4. spec-kit のブランチ作成スクリプトを実行:

```bash
.specify/scripts/bash/create-new-feature.sh --json --short-name "[short-name]" "[一行説明]"
```

5. 出力された JSON から BRANCH_NAME と SPEC_FILE のパスを記録
6. スクリプトが存在しない場合のフォールバック: `mkdir -p specs/001-[short-name]` で手動作成

### Step 4: Generate spec.md

全 `designs/` ファイルを読み込み、spec-kit の `spec-template.md` 形式で `spec.md` を生成する。

#### Section Mapping

##### User Scenarios & Testing（必須）

**ソース:** `designs/user_stories.md`

変換ルール:
- US-001 → User Story 1、US-002 → User Story 2 ...
- 優先度: Must → P1, Should → P2, Could → P3
- `ストーリー` → User Story の説明文
- `受け入れ基準` → Acceptance Scenarios（Given-When-Then をそのまま維持）
- `ソースFR` → 「Why this priority」に FR の説明を要約して記載

```markdown
### User Story 1 - [US-001のタイトル] (Priority: P1)

[US-001のストーリー文を自然言語に変換]

**Why this priority**: [ソースFRの説明を要約 + 優先度の根拠]

**Independent Test**: [受け入れ基準の最初の項目を「〜で独立テスト可能」形式に]

**Acceptance Scenarios**:

1. **Given** [事前条件], **When** [アクション], **Then** [期待結果]
2. **Given** [代替条件], **When** [アクション], **Then** [期待結果]
```

##### Edge Cases

**ソース:** `designs/functional_requirements.md` の各 FR の例外フロー

- 全 FR の「例外フロー」を収集し、Edge Cases セクションに集約

##### Requirements > Functional Requirements（必須）

**ソース:** `designs/functional_requirements.md`

**重要:** spec-kit テンプレートでは `## Requirements` の子セクションとして `### Functional Requirements` が配置される。見出し階層を正確に守ること。

変換ルール:
- FR-001 の ID をそのまま維持
- 「説明」フィールドを "System MUST [capability]" 形式に変換
- Must 優先度の FR を spec.md の Functional Requirements に含める
- Should/Could 優先度の FR は Assumptions セクションに以下の形式で記載:
  ```
  - Future consideration: [FR の説明を自然言語に変換]（元 FR-XXX, Priority: Should）
  ```
  （FR ID をそのまま記載せず自然言語に変換する。spec-kit パーサーとの混同を防ぐため）
- [NEEDS CLARIFICATION] マーカー: 事前条件やビジネスルールに曖昧さがある場合に付与（最大3個。spec-kit テンプレートの推奨に準拠）。3個を超える場合は影響度の高い順に3個を選び、残りは合理的なデフォルトで解決する

```markdown
## Requirements

### Functional Requirements

- **FR-001**: System MUST [designs/functional_requirements.md FR-001 の説明を変換]
- **FR-002**: System MUST [同上]
```

##### Key Entities

**ソース:** `designs/ubiquitous_language.md`（存在する場合）

変換ルール:
- UL の用語をエンティティとして記載
- 定義とコンテキストを含める
- 存在しない場合: FR の「アクター」と「事後条件」に出現する名詞を抽出してエンティティ化

##### Success Criteria（必須）

**ソース:** `designs/README.md` セクション2「成功の定義」

変換ルール:
- 定量指標を SC-001 形式に変換
- 技術非依存・測定可能な表現に調整（実装詳細を含めない）

##### Assumptions

**ソース:** `designs/README.md` セクション5「制約・前提条件」+ `designs/non_functional_requirements.md`

変換ルール:
- 制約条件をAssumption形式に変換
- Should/Could 優先度の FR を「将来検討」として記載
- NFR の目標値を制約として記載

### Step 5: Quality Validation

spec.md 生成後、spec-kit の品質チェックリストを実行:

1. `.specify/templates/checklist-template.md` を参照し、`specs/[feature]/checklists/requirements.md` を生成
2. 以下を検証:
   - [ ] 実装詳細（言語、FW、API）が含まれていないこと
   - [ ] 全必須セクションが完了していること
   - [ ] FR が全てテスト可能で曖昧でないこと
   - [ ] 成功基準が測定可能で技術非依存であること
   - [ ] [NEEDS CLARIFICATION] が 3 個以下であること
3. 不合格項目があれば spec.md を修正（最大3イテレーション）

### Step 6: Report Completion

```
✅ speckit-bridge 完了

📄 生成ファイル:
  .specify/memory/constitution.md  — プロジェクト原則
  specs/[feature]/spec.md          — 統合仕様書
  specs/[feature]/checklists/      — 品質チェックリスト

📊 変換サマリー:
  FR: [X]件 → Functional Requirements
  US: [X]件 → User Scenarios
  NFR: [X]件 → Assumptions / Constraints
  UL: [X]件 → Key Entities
  SC: [X]件 → Success Criteria

🔗 次のステップ:
  /speckit.plan   → 技術設計（plan.md, data-model.md, contracts/）
  /speckit.tasks  → タスク分解（tasks.md）
  /speckit.clarify → [NEEDS CLARIFICATION] の解決（該当がある場合）
```

---

## Mapping Reference (Quick View)

| designs/ ファイル | spec-kit 出力先 | 変換内容 |
|---|---|---|
| `README.md` | `constitution.md` | 目的・原則・制約・成功指標 |
| `README.md` | `spec.md` Success Criteria | 成功の定義 → SC-001 形式 |
| `README.md` | `spec.md` Assumptions | 制約・前提条件 |
| `functional_requirements.md` | `spec.md` Functional Requirements | FR-001 → "System MUST" 形式 |
| `functional_requirements.md` | `spec.md` Edge Cases | 各 FR の例外フロー |
| `non_functional_requirements.md` | `spec.md` Assumptions | NFR 目標値を制約として |
| `non_functional_requirements.md` | `constitution.md` Quality Standards | 主要 NFR を品質基準に |
| `user_stories.md` | `spec.md` User Scenarios & Testing | US → User Story (P1/P2/P3) |
| `ubiquitous_language.md` | `spec.md` Key Entities | UL 用語 → エンティティ |
| `ui_design_brief.md` | 変換対象外 | Figma 成果物として別管理 |

---

## Error Handling

| エラー | 対処 |
|--------|------|
| `designs/` が存在しない | `/requirements_designer` の実行を促す |
| `FR-001` が存在しない | Phase 2（機能要件の抽出）の完了を促す |
| `US-001` が存在しない | Phase 4B（ユーザーストーリー生成）の完了を促す |
| 品質スコア < 70 | 警告表示、ユーザー判断でオーバーライド可 |
| `specify` CLI が見つからない | `uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git@v0.4.3"` を案内（PyPI の `specify` は別パッケージなので注意） |
| `.specify/` が存在しない | `specify init --here --ai claude --force` を実行 |

---

## Language Support

- SKILL.md 自体は英語（Claude Code 規約）
- ユーザーへの出力（Step 6 レポート等）は日本語（CLAUDE.md の Communication ルールに従う）
- spec.md の言語ルール:
  - セクションヘッダ: **英語**（spec-kit テンプレート準拠。`## User Scenarios & Testing` 等）
  - FR/US/NFR の ID: **英語**（`FR-001`, `US-001` 等）
  - エンティティ名: **英語**（後続の `specify plan` が英語前提のため）
  - 説明文・ストーリー本文: **英語推奨**（後続コマンドの精度を維持するため。ユーザーが日本語を希望する場合は許容するが、`specify plan` の出力品質が下がる可能性を警告する）
