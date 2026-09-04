'use client'

import React from 'react'
import type { GuidePageData } from './GuidePagesData'
import {
  CoverTemplate,
  TestimonialTemplate,
  WelcomePhoneTemplate,
  NumberedQuestionsTemplate,
  NumberedStatsTemplate,
  ProsAndConsTemplate,
  StageCoverTemplate,
  SplitPhotoTextTemplate,
  ChecklistBadgesTemplate,
  ChecklistPhotoBottomTemplate,
  ChecklistPhotoSideTemplate,
  StagingComparisonVsTemplate,
  ArticleTwoColumnsPhotoTopTemplate,
  ArticlePhotoBottomTemplate,
  ThreeColumnsBannerTemplate,
  BeforeAfterPhotographyTemplate,
  BackcoverTemplate,
} from './templates'

interface A4PageRendererProps {
  page: GuidePageData
  totalPages?: number
  isPrintMode?: boolean
}

export function A4PageRenderer({
  page,
  totalPages = 41,
  isPrintMode = false,
}: A4PageRendererProps) {
  switch (page.layoutType) {
    case 'cover_bedroom':
      return (
        <CoverTemplate
          title={page.title}
          subtitle={page.subtitle}
          heroImage={page.heroImage}
        />
      )

    case 'testimonial_dark_card':
      return (
        <TestimonialTemplate
          pageNumber={page.pageNumber}
          heroImage={page.heroImage}
          stars={page.quoteCard?.stars}
          quote={page.quoteCard?.text}
          author={page.quoteCard?.author}
        />
      )

    case 'welcome_phone':
      return (
        <WelcomePhoneTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          paragraphs={page.paragraphs}
          agentName="Alexandre Lopez"
          agentPhone="06 13 18 01 68"
          agentEmail="contact@alexandrelopez.fr"
          agentWebsite="alexandrelopez.fr"
          agentPhoto={page.heroImage}
        />
      )

    case 'ask_yourself_badge':
      return (
        <NumberedQuestionsTemplate
          pageNumber={page.pageNumber}
          badgeText={page.badgeText}
          subtitle={page.subtitle}
          numberedItems={page.numberedItems}
          footerConditions={page.footerConditions}
          moduleTitle={page.moduleTitle}
          heroImage={page.heroImage}
        />
      )

    case 'consider_this_badge':
      return (
        <NumberedStatsTemplate
          pageNumber={page.pageNumber}
          badgeText={page.badgeText}
          subtitle={page.subtitle}
          numberedItems={page.numberedItems}
          footerNote={page.footerNote}
          moduleTitle={page.moduleTitle}
          heroImage={page.heroImage}
        />
      )

    case 'pros_and_cons_2col':
      return (
        <ProsAndConsTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          pros={page.prosCons?.pros}
          cons={page.prosCons?.cons}
          moduleTitle={page.moduleTitle}
          heroImage={page.heroImage}
        />
      )

    case 'stage_divider':
      return (
        <StageCoverTemplate
          pageNumber={page.pageNumber}
          stageNumber={page.stageNumber}
          title={page.title}
          subtitle={page.subtitle}
          paragraphs={page.paragraphs}
          heroImage={page.heroImage}
        />
      )

    case 'split_half_photo':
      return (
        <SplitPhotoTextTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          paragraphs={page.paragraphs}
          heroImage={page.heroImage}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'black_badges_list':
      return (
        <ChecklistBadgesTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          itemsWithBadges={page.itemsWithBadges}
          heroImage={page.heroImage}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'black_badges_bottom_photo':
      return (
        <ChecklistPhotoBottomTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          itemsWithBadges={page.itemsWithBadges}
          adviceBox={page.bannerBox}
          heroImage={page.heroImage}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'black_badges_side_photo':
      return (
        <ChecklistPhotoSideTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          itemsWithBadges={page.itemsWithBadges}
          heroImage={page.heroImage}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'staging_vs_comparison':
      return (
        <StagingComparisonVsTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          beforeAfter={page.beforeAfter}
          paragraphs={page.paragraphs}
        />
      )

    case 'two_column_photo_top':
      return (
        <ArticleTwoColumnsPhotoTopTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          heroImage={page.heroImage}
          twoColumnsText={page.twoColumnsText}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'cma_vs_appraisal':
      return (
        <ArticlePhotoBottomTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          paragraphs={page.paragraphs}
          adviceBox={page.bannerBox}
          heroImage={page.heroImage}
          moduleTitle={page.moduleTitle}
        />
      )

    case 'three_column_black_banner':
      return (
        <ThreeColumnsBannerTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          threeColumns={page.threeColumns}
          bannerBox={page.bannerBox}
          moduleTitle={page.moduleTitle}
          heroImage={page.heroImage}
        />
      )

    case 'photography_before_after':
      return (
        <BeforeAfterPhotographyTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          paragraphs={page.paragraphs}
          beforeAfter={page.beforeAfter}
        />
      )

    case 'backcover_dark':
      return (
        <BackcoverTemplate
          pageNumber={page.pageNumber}
          quote={page.quoteCard?.text}
        />
      )

    default:
      return (
        <ArticleTwoColumnsPhotoTopTemplate
          pageNumber={page.pageNumber}
          title={page.title}
          subtitle={page.subtitle}
          heroImage={page.heroImage}
          twoColumnsText={page.twoColumnsText}
        />
      )
  }
}
