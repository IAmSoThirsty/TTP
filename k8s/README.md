# TTP Kubernetes Manifests

Production-grade Kubernetes deployment configurations for the TTP application.

## Architecture

The Kubernetes deployment includes:
- API deployment with HorizontalPodAutoscaler
- Web frontend deployment
- ConfigMaps for configuration
- Secrets for sensitive data
- Services (ClusterIP and LoadBalancer)
- Ingress with TLS
- NetworkPolicies for security
- PodDisruptionBudgets for availability
- ServiceAccounts with RBAC

## Prerequisites

- Kubernetes cluster (EKS, GKE, or self-hosted) v1.28+
- kubectl configured to access the cluster
- Helm 3+ (for optional components)
- cert-manager for TLS certificates (optional)
- Istio service mesh (optional)

## Directory Structure

```
k8s/
├── base/              # Base manifests for all environments
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── api/           # API deployment
│   ├── web/           # Web frontend deployment
│   └── ingress.yaml
├── overlays/          # Kustomize overlays per environment
│   ├── dev/
│   ├── staging/
│   └── prod/
└── README.md
```

## Deployment

### Using kubectl

```bash
# Create namespace
kubectl apply -f base/namespace.yaml

# Create secrets (update with actual values first)
kubectl apply -f base/secrets.yaml

# Deploy application
kubectl apply -f base/

# Check deployment status
kubectl get pods -n ttp-prod
kubectl get svc -n ttp-prod
kubectl get ingress -n ttp-prod
```

### Using Kustomize

```bash
# Deploy to production
kubectl apply -k overlays/prod/

# Deploy to staging
kubectl apply -k overlays/staging/

# Deploy to development
kubectl apply -k overlays/dev/
```

## Configuration

### Secrets

Before deploying, update `base/secrets.yaml` with your actual values:
- Database credentials
- Redis connection string
- S3 access keys
- JWT secret key

Create secrets from literals:

```bash
kubectl create secret generic ttp-secrets \
  --from-literal=database-url=postgresql://user:pass@host:5432/ttp \
  --from-literal=redis-url=redis://host:6379/0 \
  --from-literal=secret-key=your-secret-key \
  --from-literal=s3-access-key=your-access-key \
  --from-literal=s3-secret-key=your-secret-key \
  -n ttp-prod
```

### ConfigMap

Update `base/configmap.yaml` with environment-specific configuration.

## Scaling

### Manual Scaling

```bash
# Scale API deployment
kubectl scale deployment/ttp-api --replicas=5 -n ttp-prod

# Scale web deployment
kubectl scale deployment/ttp-web --replicas=3 -n ttp-prod
```

### Auto-scaling (HPA)

HorizontalPodAutoscaler is configured for the API deployment:
- Min replicas: 2
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

## Monitoring

```bash
# Check pod status
kubectl get pods -n ttp-prod

# View logs
kubectl logs -f deployment/ttp-api -n ttp-prod
kubectl logs -f deployment/ttp-web -n ttp-prod

# Describe resources
kubectl describe deployment/ttp-api -n ttp-prod
kubectl describe hpa/ttp-api-hpa -n ttp-prod
```

## Troubleshooting

```bash
# Check pod events
kubectl describe pod <pod-name> -n ttp-prod

# Exec into pod
kubectl exec -it <pod-name> -n ttp-prod -- /bin/bash

# Port forward for local testing
kubectl port-forward svc/ttp-api 8000:8000 -n ttp-prod
kubectl port-forward svc/ttp-web 3000:3000 -n ttp-prod

# Check resource usage
kubectl top pods -n ttp-prod
kubectl top nodes
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/ttp-api -n ttp-prod

# Rollback to previous version
kubectl rollout undo deployment/ttp-api -n ttp-prod

# Rollback to specific revision
kubectl rollout undo deployment/ttp-api --to-revision=2 -n ttp-prod
```

## Health Checks

Both API and web deployments have:
- Liveness probes (restart unhealthy pods)
- Readiness probes (remove from load balancing when not ready)
- Startup probes (allow time for slow starts)

## Security

- Pods run as non-root user
- Read-only root filesystem
- Security contexts defined
- NetworkPolicies restrict traffic
- RBAC for service accounts
- Secrets encrypted at rest

## High Availability

- Multiple replicas across nodes
- PodDisruptionBudgets prevent simultaneous downtime
- Anti-affinity rules distribute pods
- Rolling update strategy with zero downtime

## License

MIT License - See LICENSE file for details.
